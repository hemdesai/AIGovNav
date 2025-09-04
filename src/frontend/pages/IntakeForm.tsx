/**
 * AI System Intake Form
 * Multi-step wizard for submitting AI systems for EU AI Act classification
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface IntakeFormData {
  // Basic Information
  systemName: string;
  systemDescription: string;
  systemPurpose: string;
  intendedUse: string;
  
  // EU AI Act Specific
  actorRole: 'deployer' | 'provider' | 'distributor' | 'importer' | 'manufacturer' | '';
  isGPAI: boolean;
  usesGPAI: boolean;
  providesEssentialService: boolean;
  
  // Categories and Scope
  categories: string[];
  geographicScope: 'global' | 'eu' | 'national' | 'regional' | 'local' | '';
  targetUsers: string;
  
  // Technical Details
  dataTypes: string[];
  automationLevel: 'none' | 'assistive' | 'partial' | 'conditional' | 'high' | 'full' | '';
  
  // Risk Management
  transparencyMeasures: string;
  humanOversight: string;
  performanceMetrics: string;
  biasControls: string;
  foreseenMisuse: string;
  technicalDocumentation: string;
}

const initialFormData: IntakeFormData = {
  systemName: '',
  systemDescription: '',
  systemPurpose: '',
  intendedUse: '',
  actorRole: '',
  isGPAI: false,
  usesGPAI: false,
  providesEssentialService: false,
  categories: [],
  geographicScope: '',
  targetUsers: '',
  dataTypes: [],
  automationLevel: '',
  transparencyMeasures: '',
  humanOversight: '',
  performanceMetrics: '',
  biasControls: '',
  foreseenMisuse: '',
  technicalDocumentation: ''
};

const ANNEX_III_CATEGORIES = [
  { id: 'biometrics', label: 'Biometric identification and categorisation' },
  { id: 'critical_infrastructure', label: 'Critical infrastructure management' },
  { id: 'education', label: 'Education and vocational training' },
  { id: 'employment', label: 'Employment and worker management' },
  { id: 'essential_services', label: 'Access to essential services' },
  { id: 'law_enforcement', label: 'Law enforcement' },
  { id: 'migration', label: 'Migration, asylum and border control' },
  { id: 'justice', label: 'Administration of justice' }
];

const DATA_TYPES = [
  'Personal Data',
  'Biometric Data',
  'Health Data',
  'Financial Data',
  'Location Data',
  'Behavioral Data',
  'Communication Data',
  'Publicly Available Data',
  'Synthetic Data',
  'No Personal Data'
];

export const IntakeForm: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<IntakeFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<IntakeFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 5;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    // Clear error for this field
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(c => c !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const handleDataTypeToggle = (dataType: string) => {
    setFormData(prev => ({
      ...prev,
      dataTypes: prev.dataTypes.includes(dataType)
        ? prev.dataTypes.filter(d => d !== dataType)
        : [...prev.dataTypes, dataType]
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<IntakeFormData> = {};

    switch (step) {
      case 1:
        if (!formData.systemName) newErrors.systemName = 'System name is required';
        if (!formData.systemDescription || formData.systemDescription.length < 10) {
          newErrors.systemDescription = 'Description must be at least 10 characters';
        }
        if (!formData.systemPurpose || formData.systemPurpose.length < 10) {
          newErrors.systemPurpose = 'Purpose must be at least 10 characters';
        }
        if (!formData.intendedUse || formData.intendedUse.length < 10) {
          newErrors.intendedUse = 'Intended use must be at least 10 characters';
        }
        break;

      case 2:
        if (!formData.actorRole) newErrors.actorRole = 'Actor role is required';
        if (formData.categories.length === 0) {
          newErrors.categories = ['At least one category must be selected'];
        }
        break;

      case 3:
        if (!formData.geographicScope) newErrors.geographicScope = 'Geographic scope is required';
        if (!formData.targetUsers) newErrors.targetUsers = 'Target users are required';
        if (formData.dataTypes.length === 0) {
          newErrors.dataTypes = ['At least one data type must be selected'];
        }
        if (!formData.automationLevel) newErrors.automationLevel = 'Automation level is required';
        break;

      case 4:
        if (!formData.transparencyMeasures) {
          newErrors.transparencyMeasures = 'Transparency measures are required';
        }
        if (!formData.humanOversight) {
          newErrors.humanOversight = 'Human oversight description is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/v1/intake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        navigate(`/intake/${result.data.id}/success`);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit intake form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex justify-between mb-8">
      {[1, 2, 3, 4, 5].map(step => (
        <div
          key={step}
          className={`flex-1 h-2 mx-1 rounded-full transition-colors ${
            step <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                System Name *
              </label>
              <input
                type="text"
                name="systemName"
                value={formData.systemName}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.systemName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Customer Support Chatbot"
              />
              {errors.systemName && (
                <p className="mt-1 text-sm text-red-600">{errors.systemName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                System Description *
              </label>
              <textarea
                name="systemDescription"
                value={formData.systemDescription}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.systemDescription ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Provide a detailed description of the AI system..."
              />
              {errors.systemDescription && (
                <p className="mt-1 text-sm text-red-600">{errors.systemDescription}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                System Purpose *
              </label>
              <textarea
                name="systemPurpose"
                value={formData.systemPurpose}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.systemPurpose ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="What is the main purpose of this AI system?"
              />
              {errors.systemPurpose && (
                <p className="mt-1 text-sm text-red-600">{errors.systemPurpose}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Intended Use *
              </label>
              <textarea
                name="intendedUse"
                value={formData.intendedUse}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.intendedUse ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe the intended use cases..."
              />
              {errors.intendedUse && (
                <p className="mt-1 text-sm text-red-600">{errors.intendedUse}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">EU AI Act Classification</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Role in the AI Value Chain *
              </label>
              <select
                name="actorRole"
                value={formData.actorRole}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.actorRole ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select your role...</option>
                <option value="provider">Provider (develops/places on market)</option>
                <option value="deployer">Deployer (uses the AI system)</option>
                <option value="distributor">Distributor</option>
                <option value="importer">Importer</option>
                <option value="manufacturer">Manufacturer</option>
              </select>
              {errors.actorRole && (
                <p className="mt-1 text-sm text-red-600">{errors.actorRole}</p>
              )}
            </div>

            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="isGPAI"
                  checked={formData.isGPAI}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  This is a General-Purpose AI (GPAI) model
                </span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="usesGPAI"
                  checked={formData.usesGPAI}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Uses or integrates GPAI models
                </span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="providesEssentialService"
                  checked={formData.providesEssentialService}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Provides or supports essential services
                </span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Annex III Categories * (Select all that apply)
              </label>
              <div className="space-y-2">
                {ANNEX_III_CATEGORIES.map(category => (
                  <label
                    key={category.id}
                    className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.categories.includes(category.id)}
                      onChange={() => handleCategoryToggle(category.id)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded mr-3"
                    />
                    <span className="text-sm text-gray-700">{category.label}</span>
                  </label>
                ))}
              </div>
              {errors.categories && (
                <p className="mt-1 text-sm text-red-600">{errors.categories[0]}</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Technical Details</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Geographic Scope *
              </label>
              <select
                name="geographicScope"
                value={formData.geographicScope}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.geographicScope ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select scope...</option>
                <option value="global">Global</option>
                <option value="eu">EU-wide</option>
                <option value="national">National</option>
                <option value="regional">Regional</option>
                <option value="local">Local</option>
              </select>
              {errors.geographicScope && (
                <p className="mt-1 text-sm text-red-600">{errors.geographicScope}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Users *
              </label>
              <input
                type="text"
                name="targetUsers"
                value={formData.targetUsers}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.targetUsers ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Healthcare professionals, General public, Students"
              />
              {errors.targetUsers && (
                <p className="mt-1 text-sm text-red-600">{errors.targetUsers}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Data Types Processed * (Select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {DATA_TYPES.map(dataType => (
                  <label
                    key={dataType}
                    className="flex items-center p-2 border rounded hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.dataTypes.includes(dataType)}
                      onChange={() => handleDataTypeToggle(dataType)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded mr-2"
                    />
                    <span className="text-sm text-gray-700">{dataType}</span>
                  </label>
                ))}
              </div>
              {errors.dataTypes && (
                <p className="mt-1 text-sm text-red-600">{errors.dataTypes[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Automation Level *
              </label>
              <select
                name="automationLevel"
                value={formData.automationLevel}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.automationLevel ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select level...</option>
                <option value="none">None (Human-only decision)</option>
                <option value="assistive">Assistive (Provides recommendations)</option>
                <option value="partial">Partial (Some automated decisions)</option>
                <option value="conditional">Conditional (Automated with conditions)</option>
                <option value="high">High (Mostly automated)</option>
                <option value="full">Full (Completely automated)</option>
              </select>
              {errors.automationLevel && (
                <p className="mt-1 text-sm text-red-600">{errors.automationLevel}</p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Risk Management</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transparency Measures *
              </label>
              <textarea
                name="transparencyMeasures"
                value={formData.transparencyMeasures}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.transparencyMeasures ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe transparency and explainability measures..."
              />
              {errors.transparencyMeasures && (
                <p className="mt-1 text-sm text-red-600">{errors.transparencyMeasures}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Human Oversight *
              </label>
              <textarea
                name="humanOversight"
                value={formData.humanOversight}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.humanOversight ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe human oversight mechanisms..."
              />
              {errors.humanOversight && (
                <p className="mt-1 text-sm text-red-600">{errors.humanOversight}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Performance Metrics
              </label>
              <textarea
                name="performanceMetrics"
                value={formData.performanceMetrics}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Describe how system performance is measured..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bias Controls
              </label>
              <textarea
                name="biasControls"
                value={formData.biasControls}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Describe bias detection and mitigation measures..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foreseen Misuse
              </label>
              <textarea
                name="foreseenMisuse"
                value={formData.foreseenMisuse}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Describe potential misuse scenarios..."
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Review & Submit</h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Before submitting:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Review all information for accuracy</li>
                    <li>Ensure all required fields are completed</li>
                    <li>Your submission will undergo automated risk classification</li>
                    <li>You can update the information after submission if needed</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-gray-900">Summary</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">System Name</p>
                  <p className="font-medium">{formData.systemName || 'Not provided'}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Actor Role</p>
                  <p className="font-medium capitalize">{formData.actorRole || 'Not selected'}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Categories</p>
                  <p className="font-medium">
                    {formData.categories.length > 0 
                      ? ANNEX_III_CATEGORIES
                          .filter(c => formData.categories.includes(c.id))
                          .map(c => c.label)
                          .join(', ')
                      : 'None selected'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Automation Level</p>
                  <p className="font-medium capitalize">{formData.automationLevel || 'Not selected'}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Uses GPAI</p>
                  <p className="font-medium">{formData.isGPAI || formData.usesGPAI ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">Important:</p>
                  <p>By submitting this form, you confirm that all information provided is accurate and complete to the best of your knowledge.</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm p-8">
          {renderStepIndicator()}
          
          <form onSubmit={(e) => e.preventDefault()}>
            {renderStep()}

            <div className="mt-8 flex justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="flex items-center px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  <ChevronLeft className="h-5 w-5 mr-2" />
                  Previous
                </button>
              )}
              
              <div className="ml-auto">
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Next
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Submit Intake
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};