export default function PrivacyPolicy() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

            <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
                <p>Last updated: {new Date().toLocaleDateString()}</p>

                <h2 className="text-xl font-semibold text-gray-800">1. Information We Collect</h2>
                <p>
                    We collect information you provide directly to us when you create an account, create a profile, upload documents for verification, or communicate with other users.
                </p>

                <h2 className="text-xl font-semibold text-gray-800">2. How We Use Information</h2>
                <p>
                    We use the information we collect to operate, maintain, and improve our services, such as:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Facilitating matchmaking based on career preferences.</li>
                    <li>Verifying your identity and career credentials to build trust.</li>
                    <li>Communicating with you about updates and security alerts.</li>
                </ul>

                <h2 className="text-xl font-semibold text-gray-800">3. Document Security</h2>
                <p>
                    Documents uploaded for verification (Salary Slips, ID Proofs) are accessible only to our Verification Team and Administrators. They are never shared publicly with other users.
                </p>

                <h2 className="text-xl font-semibold text-gray-800">4. Contact Us</h2>
                <p>
                    If you have any questions about this Privacy Policy, please contact us at support@careermatrimony.com.
                </p>
            </div>
        </div>
    );
}
