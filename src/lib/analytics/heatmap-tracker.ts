/**
 * Heatmap Click Tracker
 * Captures click events with coordinates and batches them for sending
 */

interface ClickEvent {
  x: number; // Percentage (0-100)
  y: number; // Percentage (0-100)
  element: string;
  section?: string;
  timestamp: number;
}

interface ScrollEvent {
  depth: number; // Percentage (0-100)
  timestamp: number;
}

class HeatmapTracker {
  private clicks: ClickEvent[] = [];
  private maxScrollDepth: number = 0;
  private scrollEvents: ScrollEvent[] = [];
  private branchId: string | null = null;
  private brandId: string | null = null;
  private sendInterval: NodeJS.Timeout | null = null;
  private isInitialized = false;
  private debounceTimer: NodeJS.Timeout | null = null;

  /**
   * Initialize the heatmap tracker
   */
  initialize(branchId: string, brandId: string) {
    if (this.isInitialized) return;

    this.branchId = branchId;
    this.brandId = brandId;
    this.isInitialized = true;

    // Add event listeners
    this.setupClickTracking();
    this.setupScrollTracking();

    // Send data every 10 seconds
    this.sendInterval = setInterval(() => this.sendData(), 10000);

    // Send data before page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => this.sendData());
      window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          this.sendData();
        }
      });
    }
  }

  /**
   * Track click events
   */
  private setupClickTracking() {
    if (typeof window === 'undefined') return;

    document.addEventListener('click', (e) => {
      // Debounce rapid clicks
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }

      this.debounceTimer = setTimeout(() => {
        this.handleClick(e);
      }, 50);
    }, { passive: true });
  }

  /**
   * Handle a click event
   */
  private handleClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (!target) return;

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate click position as percentage
    const x = Math.round((e.clientX / viewportWidth) * 100);
    const y = Math.round(((e.clientY + window.scrollY) / document.documentElement.scrollHeight) * 100);

    // Get element info
    const element = this.getElementIdentifier(target);
    const section = this.getNearestSection(target);

    // Add to clicks array
    this.clicks.push({
      x,
      y,
      element,
      section,
      timestamp: Date.now(),
    });

    // Limit stored clicks
    if (this.clicks.length > 100) {
      this.clicks = this.clicks.slice(-100);
    }
  }

  /**
   * Track scroll depth
   */
  private setupScrollTracking() {
    if (typeof window === 'undefined') return;

    let scrollTimer: NodeJS.Timeout | null = null;

    window.addEventListener('scroll', () => {
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }

      scrollTimer = setTimeout(() => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const currentScroll = window.scrollY;
        const depth = Math.round((currentScroll / scrollHeight) * 100);

        // Track maximum scroll depth
        if (depth > this.maxScrollDepth) {
          this.maxScrollDepth = depth;
        }

        // Record scroll depth at intervals (25%, 50%, 75%, 100%)
        const milestones = [25, 50, 75, 100];
        const nearestMilestone = milestones.find(m => depth >= m && !this.scrollEvents.some(s => s.depth === m));

        if (nearestMilestone) {
          this.scrollEvents.push({
            depth: nearestMilestone,
            timestamp: Date.now(),
          });
        }
      }, 100);
    }, { passive: true });
  }

  /**
   * Get an identifier for the clicked element
   */
  private getElementIdentifier(element: HTMLElement): string {
    // Check for ID
    if (element.id) {
      return `#${element.id}`;
    }

    // Check for common identifiable classes
    const importantClasses = ['btn', 'button', 'link', 'nav', 'cta', 'form', 'input'];
    const classList = Array.from(element.classList);
    const matchedClass = classList.find(c =>
      importantClasses.some(ic => c.toLowerCase().includes(ic))
    );

    if (matchedClass) {
      return `.${matchedClass}`;
    }

    // Check for data attributes
    if (element.dataset.action) {
      return `[data-action="${element.dataset.action}"]`;
    }

    // Default to tag name
    return element.tagName.toLowerCase();
  }

  /**
   * Get the nearest section containing the element
   */
  private getNearestSection(element: HTMLElement): string | undefined {
    let current: HTMLElement | null = element;

    while (current) {
      if (current.tagName.toLowerCase() === 'section') {
        return current.id || current.getAttribute('aria-labelledby') || undefined;
      }
      current = current.parentElement;
    }

    return undefined;
  }

  /**
   * Send collected data to the server
   */
  private async sendData() {
    if (!this.branchId || (this.clicks.length === 0 && this.scrollEvents.length === 0)) {
      return;
    }

    const data = {
      branchId: this.branchId,
      brandId: this.brandId,
      clicks: [...this.clicks],
      scrollDepth: this.maxScrollDepth,
      scrollEvents: [...this.scrollEvents],
      pageUrl: typeof window !== 'undefined' ? window.location.pathname : '',
      screenWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
      screenHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
    };

    // Clear arrays after copying
    this.clicks = [];
    this.scrollEvents = [];

    try {
      await fetch('/api/analytics/heatmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        // Use keepalive to ensure the request completes even if page is closing
        keepalive: true,
      });
    } catch (error) {
      console.error('Error sending heatmap data:', error);
      // Restore data if send failed
      this.clicks = data.clicks;
      this.scrollEvents = data.scrollEvents;
    }
  }

  /**
   * Clean up the tracker
   */
  destroy() {
    if (this.sendInterval) {
      clearInterval(this.sendInterval);
    }
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.sendData();
    this.isInitialized = false;
  }
}

// Export singleton instance
export const heatmapTracker = new HeatmapTracker();

/**
 * Hook to initialize heatmap tracking on a microsite
 */
export function initializeHeatmapTracking(branchId: string, brandId: string) {
  if (typeof window !== 'undefined') {
    heatmapTracker.initialize(branchId, brandId);
  }
}
