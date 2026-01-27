export default function TermsOfService() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>

            <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
                <p>Effective Date: {new Date().toLocaleDateString()}</p>

                <h2 className="text-xl font-semibold text-gray-800">1. Acceptance of Terms</h2>
                <p>
                    By accessing or using Career Matrimony, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                </p>

                <h2 className="text-xl font-semibold text-gray-800">2. Eligibility</h2>
                <p>
                    You must be at least 18 years old to use this Service. By using the Service, you represent and warrant that you have the right, authority, and capacity to enter into this Agreement.
                </p>

                <h2 className="text-xl font-semibold text-gray-800">3. User Conduct</h2>
                <p>
                    You agree not to:
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Post false or misleading information in your profile.</li>
                        <li>Harass, bully, or intimidate other users.</li>
                        <li>Upload documents that you do not own or have the right to use.</li>
                    </ul>
                </p>

                <h2 className="text-xl font-semibold text-gray-800">4. Termination</h2>
                <p>
                    We reserve the right to suspend or terminate your account at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users of the Service.
                </p>
            </div>
        </div>
    );
}
