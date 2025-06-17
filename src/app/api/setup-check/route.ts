import { NextResponse } from 'next/server';

export async function GET() {
  const checks = {
    environment: {
      status: 'success',
      message: 'Environment variables loaded',
      details: {},
    },
    firebase: {
      status: 'unknown',
      message: 'Firebase configuration check',
      details: {},
    },
    openai: {
      status: 'unknown',
      message: 'OpenAI API configuration check',
      details: {},
    },
  };

  // Check environment variables
  const requiredEnvVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
    'OPENAI_API_KEY',
  ];

  const missingVars = requiredEnvVars.filter(
    varName => !process.env[varName] || process.env[varName]?.includes('your_')
  );

  if (missingVars.length > 0) {
    checks.environment.status = 'error';
    checks.environment.message = `Missing or placeholder environment variables: ${missingVars.join(
      ', '
    )}`;
    checks.environment.details = { missingVars };
  }

  // Check Firebase configuration
  const firebaseVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
  ];

  const missingFirebaseVars = firebaseVars.filter(
    varName => !process.env[varName] || process.env[varName]?.includes('your_')
  );

  if (missingFirebaseVars.length === 0) {
    checks.firebase.status = 'success';
    checks.firebase.message = 'Firebase configuration appears complete';
    checks.firebase.details = {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    };
  } else {
    checks.firebase.status = 'error';
    checks.firebase.message = `Missing Firebase variables: ${missingFirebaseVars.join(
      ', '
    )}`;
    checks.firebase.details = { missingFirebaseVars };
  }

  // Check OpenAI configuration
  if (
    !process.env.OPENAI_API_KEY ||
    process.env.OPENAI_API_KEY.includes('your_')
  ) {
    checks.openai.status = 'warning';
    checks.openai.message = 'OpenAI API key not configured - using demo mode';
    checks.openai.details = {
      demoMode: true,
      note: 'Demo mode provides sample content for testing',
    };
  } else {
    checks.openai.status = 'success';
    checks.openai.message = 'OpenAI API key configured';
    checks.openai.details = {
      demoMode: false,
      keyPrefix: process.env.OPENAI_API_KEY.substring(0, 7) + '...',
    };
  }

  // Overall status
  const hasErrors = Object.values(checks).some(
    check => check.status === 'error'
  );
  const hasWarnings = Object.values(checks).some(
    check => check.status === 'warning'
  );

  let overallStatus = 'success';
  let overallMessage = 'All systems ready!';

  if (hasErrors) {
    overallStatus = 'error';
    overallMessage =
      'Configuration errors detected. Please check your environment variables.';
  } else if (hasWarnings) {
    overallStatus = 'warning';
    overallMessage =
      'Configuration warnings detected. Some features may use demo mode.';
  }

  return NextResponse.json({
    status: overallStatus,
    message: overallMessage,
    timestamp: new Date().toISOString(),
    checks,
    recommendations: {
      firebase:
        missingFirebaseVars.length > 0
          ? [
              'Create a Firebase project at https://console.firebase.google.com',
              'Enable Authentication (Email/Password and Google)',
              'Create a Firestore database',
              'Copy configuration values to .env.local',
            ]
          : [],
      openai:
        !process.env.OPENAI_API_KEY ||
        process.env.OPENAI_API_KEY.includes('your_')
          ? [
              'Get an OpenAI API key from https://platform.openai.com/api-keys',
              'Add OPENAI_API_KEY to your .env.local file',
              'Restart the development server',
            ]
          : [],
    },
  });
}
