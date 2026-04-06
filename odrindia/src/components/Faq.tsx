import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle, User, Lightbulb, Users, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqCategories = {
	"getting-started": {
		title: "Getting Started",
		icon: <User className="h-5 w-5" />,
		questions: [
			{
				question: "What is ODRLab.com?",
				answer: "ODRLab.com is a digital platform where legal-tech enthusiasts can collaborate to design and build Online Dispute Resolution (ODR) systems. It brings together legal professionals, technologists, students, educators, and institutions to co-create accessible, tech-driven solutions.",
			},
			{
				question: "Who can join ODRLab?",
				answer: "Anyone interested in legal tech innovation and dispute resolution, including: Law and tech students, Faculty and researchers, Legal professionals and mediators, Developers and designers, ODR and conflict resolution experts.",
			},
			{
				question: "What can I do on ODRLab.com?",
				answer: "You can share and collaborate on ideas via the Idea Board, join workshops, discussions, and mentorship sessions, access ODR tools, research, and resources, co-design and test prototypes, and compare existing ODR systems.",
			},
			{
				question: "Is there a participation fee?",
				answer: "No, ODRLab is free for all users.",
			}
		]
	},
	"idea-board": {
		title: "Idea Board & Projects",
		icon: <Lightbulb className="h-5 w-5" />,
		questions: [
			{
				question: "What is the Idea Board on the ODRLab?",
				answer: "A digital space where registered users can propose, post, and collaborate on designing and developing ODR-related ideas and innovations. The Idea Board allows users to share their ideas, which others can join and contribute to.",
			},
			{
				question: "What happens after an idea is submitted on the Idea Board?",
				answer: "Ideas are reviewed by ODRLab Ambassadors and published with credit to the innovator on the ODRLab.",
			},
			{
				question: "What happens once my idea is published?",
				answer: "Other users interested in your idea can join the discussion. You can collaborate, create a discussion thread, and get guidance from mentors or the Curio chatbot.",
			},
			{
				question: "How can I get guidance for developing my idea submitted on the Idea Board?",
				answer: "You can connect to any of the mentors or, for instant assistance, ask our AI Agent Curio—our chatbot.",
			},
			{
				question: "Is there a time limit to complete an idea?",
				answer: "Yes, all projects must be completed within 6 months of initiation.",
			}
		]
	},
	"collaboration": {
		title: "Collaboration & Mentorship",
		icon: <Users className="h-5 w-5" />,
		questions: [
			{
				question: "Who can be a mentor?",
				answer: "Experienced professionals in law, tech, mediation, education, or policy who are willing to mentor on a pro bono basis. Register on the platform and choose 'Mentor' as your role. Your application will be reviewed and accepted by the ODRLab Team.",
			},
			{
				question: "What is a mentor's role?",
				answer: "Mentors support innovators by guiding idea development, providing feedback, sharing resources and networks, and promoting ethical, practical solutions.",
			},
			{
				question: "What do innovators and collaborators gain by using ODRLab?",
				answer: "Practical experience in legal-tech innovation, global collaboration opportunities, mentorship from industry leaders, and skills in law, technology, and design thinking.",
			},
			{
				question: "Can teachers/faculty use ODRLab for teaching?",
				answer: "Yes. Faculty can integrate ODRLab for experiential learning and register themselves and their students for collaborative projects.",
			},
			{
				question: "How can I become a student ambassador?",
				answer: "If you'd like to represent ODRLab at your institution or country, email us at contact@odrlab.com.",
			}
		]
	},
	"policies": {
		title: "Policies & Rights",
		icon: <Shield className="h-5 w-5" />,
		questions: [
			{
				question: "Who owns the idea submitted on the Idea Board and developed into an ODR system?",
				answer: "Innovators and collaborators retain full Intellectual Property (IP) rights. Co-development agreements may apply for collaborative projects.",
			}
		]
	}
};

// Animation variants
const fadeInUp = {
	hidden: { opacity: 0, y: 20 },
	visible: { 
		opacity: 1, 
		y: 0,
		transition: { duration: 0.6 }
	}
};

const staggerContainer = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1
		}
	}
};

const tabAnimation = {
	hidden: { opacity: 0, y: 10 },
	visible: { 
		opacity: 1, 
		y: 0,
		transition: { duration: 0.4 }
	}
};

const faqCardAnimation = {
	hidden: { opacity: 0, y: 15 },
	visible: { 
		opacity: 1, 
		y: 0,
		transition: { duration: 0.5 }
	}
};

export function FAQ() {
	const [activeTab, setActiveTab] = useState("getting-started");
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	const toggleFAQ = (index: number) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	const currentCategory = faqCategories[activeTab as keyof typeof faqCategories];

	return (
		<motion.section 
			className="py-20 bg-gradient-to-b from-gray-100 to-indigo-100"
			initial={{ opacity: 0 }}
			whileInView={{ opacity: 1 }}
			transition={{ duration: 0.8 }}
			viewport={{ once: true, margin: "-100px" }}
		>
			<div className="container mx-auto px-6">
				{/* Animated background elements */}
				<motion.div 
					className="absolute top-20 right-10 w-60 h-60 rounded-full bg-[#3a86ff]/5"
					animate={{ 
						scale: [1, 1.2, 1],
						opacity: [0.3, 0.5, 0.3]
					}}
					transition={{ duration: 8, repeat: Infinity }}
				/>
				<motion.div 
					className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-indigo-400/5"
					animate={{ 
						scale: [1, 1.1, 1],
						opacity: [0.2, 0.4, 0.2]
					}}
					transition={{ duration: 6, repeat: Infinity }}
				/>

				<motion.div 
					className="mb-16 text-center"
					initial="hidden"
					whileInView="visible"
					variants={staggerContainer}
					viewport={{ once: true }}
				>
					<motion.div 
						className="mb-6 flex justify-center"
						variants={fadeInUp}
					>
						<div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
							<HelpCircle className="h-12 w-12 text-[#3a86ff]" />
						</div>
					</motion.div>
					<motion.h2 
						className="mb-4 text-4xl font-extrabold tracking-tight text-[#0a1e42] sm:text-5xl md:text-6xl"
						variants={fadeInUp}
					>
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0a1e42] to-[#3a86ff]">
							Frequently Asked Questions
						</span>
					</motion.h2>
					<motion.p 
						className="mx-auto max-w-[700px] text-lg text-gray-600 sm:text-xl md:text-2xl"
						variants={fadeInUp}
					>
						Find answers to common questions about ODRLab and how to get started
					</motion.p>
					<motion.div 
						className="mt-6 mx-auto w-24 h-1 bg-gradient-to-r from-[#3a86ff] to-indigo-600 rounded-full"
						variants={fadeInUp}
					></motion.div>
				</motion.div>

				{/* Category Tabs */}
				<motion.div 
					className="max-w-4xl mx-auto mb-8"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					viewport={{ once: true }}
				>
					<motion.div 
						className="flex flex-wrap justify-center gap-2 bg-white/90 backdrop-blur-sm rounded-xl p-2 shadow-lg"
						variants={staggerContainer}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
					>
						{Object.entries(faqCategories).map(([key, category], index) => (
							<motion.button
								key={key}
								variants={tabAnimation}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => {
									setActiveTab(key);
									setOpenIndex(null);
								}}
								className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
									activeTab === key
										? 'bg-gradient-to-r from-[#3a86ff] to-indigo-600 text-white shadow-lg'
										: 'text-gray-600 hover:text-[#3a86ff] hover:bg-blue-50'
								}`}
							>
								<span className={`${activeTab === key ? 'text-white' : 'text-[#3a86ff]'}`}>
									{category.icon}
								</span>
								<span className="text-sm">{category.title}</span>
							</motion.button>
						))}
					</motion.div>
				</motion.div>

				{/* FAQ Items for Active Category */}
				<motion.div 
					className="max-w-4xl mx-auto space-y-4"
					initial="hidden"
					whileInView="visible"
					variants={staggerContainer}
					viewport={{ once: true }}
				>
					<AnimatePresence mode="wait">
						{currentCategory.questions.map((faq, index) => (
							<motion.div
								key={`${activeTab}-${index}`}
								variants={faqCardAnimation}
								initial="hidden"
								animate="visible"
								exit="hidden"
								transition={{ delay: index * 0.1 }}
								whileHover={{ 
									scale: 1.02,
									boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
								}}
								className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
							>
								<button
									onClick={() => toggleFAQ(index)}
									className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group"
								>
									<div className="flex items-center space-x-4">
										<motion.div 
											className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#3a86ff] to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm"
											whileHover={{ scale: 1.1 }}
											transition={{ type: "spring", stiffness: 400, damping: 10 }}
										>
											{index + 1}
										</motion.div>
										<h3 className="text-lg font-semibold text-[#0a1e42] group-hover:text-[#3a86ff] transition-colors duration-300 sm:text-xl md:text-2xl">
											{faq.question}
										</h3>
									</div>
									<div className="flex-shrink-0 ml-4">
										<motion.div
											animate={{ rotate: openIndex === index ? 180 : 0 }}
											transition={{ duration: 0.3 }}
										>
											{openIndex === index ? (
												<ChevronUp className="h-6 w-6 text-[#3a86ff]" />
											) : (
												<ChevronDown className="h-6 w-6 text-gray-400 group-hover:text-[#3a86ff] transition-colors duration-300" />
											)}
										</motion.div>
									</div>
								</button>

								<AnimatePresence>
									{openIndex === index && (
										<motion.div
											initial={{ height: 0, opacity: 0 }}
											animate={{ height: "auto", opacity: 1 }}
											exit={{ height: 0, opacity: 0 }}
											transition={{ duration: 0.3, ease: "easeInOut" }}
											className="overflow-hidden"
										>
											<div className="px-8 pb-6">
												<div className="pl-12 pr-10">
													<motion.div 
														className="h-px bg-gradient-to-r from-[#3a86ff]/20 to-indigo-600/20 mb-4"
														initial={{ scaleX: 0 }}
														animate={{ scaleX: 1 }}
														transition={{ duration: 0.5, delay: 0.1 }}
													></motion.div>
													<motion.p 
														className="text-gray-600 leading-relaxed text-sm sm:text-base md:text-lg"
														initial={{ opacity: 0, y: 10 }}
														animate={{ opacity: 1, y: 0 }}
														transition={{ duration: 0.3, delay: 0.2 }}
													>
														{faq.answer}
													</motion.p>
												</div>
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</motion.div>
						))}
					</AnimatePresence>
				</motion.div>

				<motion.div 
					className="mt-16 text-center"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					viewport={{ once: true }}
				>
					<motion.div 
						className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg max-w-2xl mx-auto"
						whileHover={{ 
							scale: 1.02,
							boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.1)"
						}}
						transition={{ type: "spring", stiffness: 400, damping: 10 }}
					>
						<motion.h3 
							className="text-xl font-bold text-[#0a1e42] mb-4"
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							transition={{ duration: 0.5, delay: 0.2 }}
							viewport={{ once: true }}
						>
							Still have questions?
						</motion.h3>
						<motion.p 
							className="text-gray-600 mb-6"
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							transition={{ duration: 0.5, delay: 0.3 }}
							viewport={{ once: true }}
						>
							Can&apos;t find the answer you&apos;re looking for? Feel free to reach out to our support team.
						</motion.p>
						<motion.a
							href="mailto:contact@odrlab.com"
							className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#0a1e42] to-[#3a86ff] text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							initial={{ opacity: 0, y: 10 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.4 }}
							viewport={{ once: true }}
						>
							Contact Support
						</motion.a>
					</motion.div>
				</motion.div>
			</div>
		</motion.section>
	);
}