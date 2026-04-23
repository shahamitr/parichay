/**
 * Layout Components
 *
 * Comprehensive layout system for creating asymmetric, visually engaging sections.
 * Implements Requirements 1.1, 1.2, 1.3, 1.4, and 1.5 from the microsite visual enhancements spec.
 */

// Asymmetric Layout System
export {
  AsymmetricSection,
  getAlternatingPosition,
  type AsymmetricSectionProps,
} from './AsymmetricSection';

// Decorative Background Elements
export {
  BlobShape,
  GradientPattern,
  HeadingBackground,
  DecorativeBackground,
  type BlobShapeProps,
  type GradientPatternProps,
  type HeadingBackgroundProps,
  type DecorativeBackgroundProps,
} from './DecorativeBackground';

// Container and Section Components
export {
  Container,
  Section,
  SectionSpacer,
  GridContainer,
  type ContainerProps,
  type SectionProps,
  type SectionSpacerProps,
  type GridContainerProps,
} from './Container';
