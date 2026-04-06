import React from 'react';

export default function PrivacyPolicy() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Privacy Policy</h1>
                
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 md:p-8">
                    <h2 className="text-xl md:text-2xl font-semibold mb-4">Google Sign-In Information</h2>
                    
                    <div className="space-y-4 text-gray-700 dark:text-gray-300">
                        <p>
                            ODRlab offers the option to sign up or log in to our platform using your Google account through Google 
                            Sign-In (OAuth 2.0). When you choose this method, we may receive certain information from your Google 
                            profile, including your name, email address, profile picture, and a unique account identifier.
                        </p>
                        
                        <p>
                            This information is used solely to authenticate your identity, facilitate account creation, and provide a 
                            personalized and secure user experience. We do not access or store your Google password.
                        </p>
                        
                        <p>
                            Your Google account data is handled in accordance with Google&apos;s API Services User Data Policy, 
                            including the Limited Use requirements. By using Google Sign-In, you also agree to Google&apos;s own privacy 
                            practices, which can be reviewed at{' '}
                            <a 
                                href="https://policies.google.com/privacy" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                https://policies.google.com/privacy
                            </a>.
                        </p>
                        
                        <p>
                            You may revoke our access to your Google account at any time through your Google Account permissions page.
                        </p>
                    </div>
                    
                    <h2 className="text-xl md:text-2xl font-semibold my-6">Contact Us</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        If you have any questions about this Privacy Policy, please contact us at{' '}
                        <a 
                            href="mailto:contact@odrindia.com" 
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            contact@odrlab.com
                        </a>
                    </p>
                    
                    <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
                        <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}