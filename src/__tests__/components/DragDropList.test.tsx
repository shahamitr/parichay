import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DragDropList, DragHandle } from '@/components/ui/DragDropList';

describe('DragDropList Component', () => {
  const items = [
    { id: '1', name: 'First' },
    { id: '2', name: 'Second' },
    { id: '3', name: 'Third' },
  ];

  it('should render all items', () => {
    render(
      <DragDropList
        items={items}
        onReorder={vi.fn()}
        keyExtractor={(item) => item.id}
        renderItem={(item, _index, dragHandleProps) => (
          <div>
            <DragHandle {...dragHandleProps} />
            <span>{item.name}</span>
          </div>
        )}
      />
    );

    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.getByText('Third')).toBeInTheDocument();
  });

  it('should render drag handles for each item', () => {
    render(
      <DragDropList
        items={items}
        onReorder={vi.fn()}
        keyExtractor={(item) => item.id}
        renderItem={(item, _index, dragHandleProps) => (
          <div>
            <DragHandle {...dragHandleProps} />
            <span>{item.name}</span>
          </div>
        )}
      />
    );

    const handles = screen.getAllByLabelText(/Drag to reorder/);
    expect(handles).toHaveLength(3);
  });

  it('should make items draggable', () => {
    const { container } = render(
      <DragDropList
        items={items}
        onReorder={vi.fn()}
        keyExtractor={(item) => item.id}
        renderItem={(item) => <div>{item.name}</div>}
      />
    );

    const draggables = container.querySelectorAll('[draggable="true"]');
    expect(draggables).toHaveLength(3);
  });
});
