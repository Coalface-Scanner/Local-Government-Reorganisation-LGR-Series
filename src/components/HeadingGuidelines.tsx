import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { validateHeadingStructure, getHeadingHierarchy, type HeadingValidationResult } from '../lib/headingValidator';

interface HeadingGuidelinesProps {
  htmlContent: string;
}

export default function HeadingGuidelines({ htmlContent }: HeadingGuidelinesProps) {
  if (!htmlContent || htmlContent.trim().length === 0) {
    return null;
  }

  const validation = validateHeadingStructure(htmlContent);
  const hierarchy = getHeadingHierarchy(htmlContent);

  return (
    <div className="mt-4 space-y-4">
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="text-slate-600 flex-shrink-0 mt-0.5" size={18} />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Heading Structure Guidelines</h4>
            <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
              <li>Use exactly one H1 heading (main page title)</li>
              <li>Use H2 for major sections</li>
              <li>Use H3 for subsections under H2</li>
              <li>Don't skip heading levels (e.g., H1 → H3)</li>
              <li>Make headings descriptive and meaningful</li>
            </ul>
          </div>
        </div>
      </div>

      {validation.headings.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-slate-900 mb-2">Current Heading Structure</h4>
          <pre className="text-xs text-slate-600 bg-slate-50 p-3 rounded border border-slate-200 overflow-x-auto">
            {hierarchy}
          </pre>
        </div>
      )}

      {validation.warnings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-amber-900 mb-2">Heading Issues Found</h4>
              <ul className="text-xs text-amber-800 space-y-1 list-disc list-inside">
                {validation.warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {validation.isValid && validation.headings.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-green-900 mb-1">Heading Structure Valid</h4>
              <p className="text-xs text-green-800">
                Found {validation.h1Count} H1, {validation.h2Count} H2, {validation.h3Count} H3 heading(s)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
