'use client';

import { useSearchParams } from 'next/navigation';
import { AlertTriangle, Lock, XCircle, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function AccessBlockedPage() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');
  const message = searchParams.get('message');

  const getBlockedPageContent = () => {
    switch (reason) {
      case 'suspended':
        return {
          icon: Lock,
          title: 'Account Suspended',
          description: message || 'Your account has been temporarily suspended.',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          message:
            'This action was taken by our system administrators. If you believe this is a mistake, please contact support.',
          actionText: 'Contact Support',
        };
      case 'org-disabled':
        return {
          icon: Building2,
          title: 'Organization Disabled',
          description: message || 'Your organization has been disabled and is no longer accessible.',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          message:
            'Contact your organization administrator or our support team for more information.',
          actionText: 'Contact Support',
        };
      case 'inactive':
        return {
          icon: XCircle,
          title: 'Account Inactive',
          description: message || 'Your account has been marked as inactive.',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          message: 'Please contact our support team to reactivate your account.',
          actionText: 'Contact Support',
        };
      default:
        return {
          icon: AlertTriangle,
          title: 'Access Denied',
          description: 'You do not have permission to access this resource.',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          message: 'If you believe this is an error, please reach out to our support team.',
          actionText: 'Contact Support',
        };
    }
  };

  const content = getBlockedPageContent();
  const IconComponent = content.icon;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md">
        <div className={`${content.bgColor} rounded-lg shadow-lg border border-gray-200 p-8`}>
          <div className="flex justify-center mb-6">
            <IconComponent className={`${content.color} w-16 h-16`} />
          </div>

          <h1 className={`${content.color} text-2xl font-bold text-center mb-2`}>
            {content.title}
          </h1>

          <p className="text-gray-700 text-center mb-4">{content.description}</p>

          <div className="bg-white rounded p-4 mb-6 border-l-4 border-gray-300">
            <p className="text-sm text-gray-600">{content.message}</p>
          </div>

          <div className="space-y-3">
            <a
              href="mailto:support@healthyflow.com?subject=Access Blocked"
              className={`${content.color} w-full inline-flex items-center justify-center px-4 py-3 rounded-lg font-medium hover:opacity-80 transition-opacity`}
            >
              {content.actionText}
            </a>
            <Link
              href="/"
              className="w-full inline-flex items-center justify-center px-4 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Go to Home
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Need additional help? Try these resources:
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/contact-us"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Help Center
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              href="/"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Home Page
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Issue ID: {reason || 'ACCESS_DENIED'}</p>
          <p>{new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
