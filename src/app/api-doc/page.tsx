'use client';

import { useEffect, useState } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function ApiDocumentation() {
  const [spec, setSpec] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApiSpec = async () => {
      try {
        const response = await fetch('/api/docs');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const apiSpec = await response.json();
        setSpec(apiSpec);
      } catch (err) {
        console.error('Failed to fetch API specification:', err);
        setError(err instanceof Error ? err.message : 'Failed to load API documentation');
      } finally {
        setLoading(false);
      }
    };

    fetchApiSpec();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading API Documentation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Parichay API Documentation</h1>
          <p className="text-xl opacity-90">
            Comprehensive API documentation for the Parichay digital business card platform
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <span className="bg-white/20 px-3 py-1 rounded-full">
              OpenAPI 3.0
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full">
              REST API
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full">
              JWT Authentication
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full">
              Interactive Testing
            </span>
          </div>
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">🚀 Quick Start</h3>
              <p className="text-sm text-gray-600">
                1. Register/Login to get your JWT token<br/>
                2. Click "Authorize" button below<br/>
                3. Enter your token and start testing
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">📚 Key Features</h3>
              <p className="text-sm text-gray-600">
                • Brand & Branch Management<br/>
                • Lead Capture & CRM<br/>
                • QR Code Generation<br/>
                • Analytics & Reporting
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">🔗 Base URLs</h3>
              <p className="text-sm text-gray-600">
                <strong>Dev:</strong> http://localhost:3000/api<br/>
                <strong>Prod:</strong> https://api.parichay.com
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Swagger UI */}
      <div className="swagger-container">
        {spec && (
          <SwaggerUI
            spec={spec}
            deepLinking={true}
            displayOperationId={false}
            defaultModelsExpandDepth={1}
            defaultModelExpandDepth={1}
            defaultModelRendering="example"
            displayRequestDuration={true}
            docExpansion="list"
            filter={true}
            showExtensions={true}
            showCommonExtensions={true}
            tryItOutEnabled={true}
            requestInterceptor={(request) => {
              // Add correlation ID to all requests
              request.headers['X-Correlation-ID'] = `swagger-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
              return request;
            }}
            responseInterceptor={(response) => {
              // Log response for debugging
              console.log('API Response:', {
                url: response.url,
                status: response.status,
                headers: response.headers
              });
              return response;
            }}
            onComplete={(system) => {
              console.log('Swagger UI loaded successfully');
            }}
            plugins={[
              {
                statePlugins: {
                  spec: {
                    wrapSelectors: {
                      allowTryItOutFor: () => () => true
                    }
                  }
                }
              }
            ]}
          />
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
          <p className="text-gray-300 mb-4">
            Check out our guides and examples to get started quickly
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="/docs/getting-started"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm transition-colors"
            >
              Getting Started Guide
            </a>
            <a
              href="/docs/api-examples"
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-sm transition-colors"
            >
              API Examples
            </a>
            <a
              href="mailto:support@parichay.com"
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .swagger-container {
          max-width: none;
        }

        .swagger-ui .topbar {
          display: none;
        }

        .swagger-ui .info {
          margin: 20px 0;
        }

        .swagger-ui .scheme-container {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 4px;
          padding: 10px;
          margin: 20px 0;
        }

        .swagger-ui .auth-wrapper {
          display: flex;
          justify-content: flex-end;
          margin: 20px 0;
        }

        .swagger-ui .btn.authorize {
          background-color: #28a745;
          border-color: #28a745;
        }

        .swagger-ui .btn.authorize:hover {
          background-color: #218838;
          border-color: #1e7e34;
        }

        .swagger-ui .opblock.opblock-post {
          border-color: #28a745;
        }

        .swagger-ui .opblock.opblock-post .opblock-summary {
          border-color: #28a745;
        }

        .swagger-ui .opblock.opblock-get {
          border-color: #007bff;
        }

        .swagger-ui .opblock.opblock-get .opblock-summary {
          border-color: #007bff;
        }

        .swagger-ui .opblock.opblock-put {
          border-color: #ffc107;
        }

        .swagger-ui .opblock.opblock-put .opblock-summary {
          border-color: #ffc107;
        }

        .swagger-ui .opblock.opblock-delete {
          border-color: #dc3545;
        }

        .swagger-ui .opblock.opblock-delete .opblock-summary {
          border-color: #dc3545;
        }

        .swagger-ui .response-col_status {
          font-weight: bold;
        }

        .swagger-ui .response.highlighted {
          background: rgba(40, 167, 69, 0.1);
          border-left: 4px solid #28a745;
        }

        .swagger-ui .model-box {
          background: #f8f9fa;
          border-radius: 4px;
          padding: 10px;
        }

        .swagger-ui .model-title {
          color: #495057;
          font-weight: 600;
        }

        .swagger-ui .parameter__name {
          font-weight: 600;
          color: #495057;
        }

        .swagger-ui .parameter__type {
          color: #6c757d;
          font-size: 12px;
        }

        .swagger-ui .opblock-summary-description {
          color: #6c757d;
        }

        .swagger-ui .execute-wrapper {
          text-align: right;
          margin-top: 10px;
        }

        .swagger-ui .btn.execute {
          background-color: #007bff;
          border-color: #007bff;
          color: white;
          font-weight: 600;
        }

        .swagger-ui .btn.execute:hover {
          background-color: #0056b3;
          border-color: #004085;
        }
      `}</style>
    </div>
  );
}