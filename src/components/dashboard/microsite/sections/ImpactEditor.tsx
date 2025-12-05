'use client';

import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { ImpactSection, MetricItem } from '@/types/microsite';

interface ImpactEditorProps {
  config?: ImpactSection;
  onChange: (data: ImpactSection) => void;
}

export default function ImpactEditor({ config = { enabled: false, metrics: [] }, onChange }: ImpactEditorProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleChange = (field: string, value: any) => {
    onChange({ ...config, [field]: value });
  };

  const addMetric = () => {
    const newMetric: MetricItem = {
      value: '',
      label: '',
      icon: 'users',
    };
    handleChange('metrics', [...(config.metrics || []), newMetric]);
  };

  const removeMetric = (index: number) => {
    const newMetrics = config.metrics.filter((_, i) => i !== index);
    handleChange('metrics', newMetrics);
  };

  const updateMetric = (index: number, field: string, value: any) => {
    const newMetrics = [...config.metrics];
    newMetrics[index] = { ...newMetrics[index], [field]: value };
    handleChange('metrics', newMetrics);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newMetrics = [...config.metrics];
    const draggedItem = newMetrics[draggedIndex];
    newMetrics.splice(draggedIndex, 1);
    newMetrics.splice(index, 0, draggedItem);

    handleChange('metrics', newMetrics);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const iconOptions = [
    { value: 'users', label: '👥 Users' },
    { value: 'star', label: '⭐ Star' },
    { value: 'trophy', label: '🏆 Trophy' },
    { value: 'heart', label: '❤️ Heart' },
    { value: 'check', label: '✓ Check' },
    { value: 'calendar', label: '📅 Calendar' },
    { value: 'globe', label: '🌍 Globe' },
    { value: 'rocket', label: '🚀 Rocket' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Impact/Metrics Section</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Show your achievements with impressive numbers and statistics
        </p>
      </div>

      {/* Enable/Disable Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Enable Impact Section</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Show or hide this section on your microsite
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => handleChange('enabled', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
        </label>
      </div>

      {config.enabled && (
        <>
          {/* Add Metric Button */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Metrics ({config.metrics?.length || 0})
            </h3>
            <button
              onClick={addMetric}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Metric
            </button>
          </div>

          {/* Metrics List */}
          {config.metrics && config.metrics.length > 0 ? (
            <div className="space-y-4">
              {config.metrics.map((metric, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6 ${draggedIndex === index ? 'opacity-50' : ''
                    }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="cursor-move text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 mt-2">
                      <GripVertical className="w-5 h-5" />
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Value */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Value *
                        </label>
                        <input
                          type="text"
                          value={metric.value}
                          onChange={(e) => updateMetric(index, 'value', e.target.value)}
                          placeholder="10,000+"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                        />
                      </div>

                      {/* Label */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Label *
                        </label>
                        <input
                          type="text"
                          value={metric.label}
                          onChange={(e) => updateMetric(index, 'label', e.target.value)}
                          placeholder="Happy Clients"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                        />
                      </div>

                      {/* Icon */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Icon
                        </label>
                        <select
                          value={metric.icon || 'users'}
                          onChange={(e) => updateMetric(index, 'icon', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          {iconOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => removeMetric(index)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Remove metric"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No metrics added yet</p>
              <button
                onClick={addMetric}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Metric
              </button>
            </div>
          )}

          {/* Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">💡 Impact Tips</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
              <li>Use round numbers for better impact (10,000+ vs 9,847)</li>
              <li>Keep labels short and clear (2-3 words)</li>
              <li>Choose icons that match your metrics</li>
              <li>Limit to 3-4 key metrics for maximum impact</li>
              <li>Update numbers regularly to stay current</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
