import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="bg-[#0a1e42] text-white pt-3.5">
      <div className="container mx-auto px-4 py-2">
        <div className="grid gap-10 items-stretch md:grid-cols-3 lg:grid-cols-3">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">ODR</h3>
            <p className="text-gray-300">
              Online Dispute Resolution (ODR) leverages technology — automated, augmented, or assisted — to design innovative systems that simplify conflict resolution, facilitate dialogue, streamline processes, and provide both human and AI-driven support, customized to the needs of each dispute.
            </p>
            {/* <div className="flex space-x-4">
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </Button>
              </Link>
              <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Facebook className="h-4 w-4" />
                  <span className="sr-only">Facebook</span>
                </Button>
              </Link>
              <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Linkedin className="h-4 w-4" />
                  <span className="sr-only">LinkedIn</span>
                </Button>
              </Link>
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Instagram className="h-4 w-4" />
                  <span className="sr-only">Instagram</span>
                </Button>
              </Link>
            </div> */}
          </div>

          <div className="space-y-2 w-fit">
            <h3 className="text-xl font-bold">Quick Links</h3>
            <ul className="space-y-1">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/odrlabs" className="text-gray-300 hover:text-white">
                  ODR Lab
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold">ODR News</h3>
            <p className="text-gray-300">Have ODR news to share?</p>
            <p className="text-gray-300">
              We are happy to feature it! Email us at{" "}
              <a href="mailto:contact@odrlab.com" className="text-sky-400 hover:text-sky-300 underline">
                contact@odrlab.com
              </a>{""}.
            </p>
          </div>
        </div>

        <div className="mt-2 border-t border-gray-700 pt-4 mb-2">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-gray-300 md:text-left">
              © 2025 ODR Lab. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy-policy" className="text-sm text-gray-300 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-sm text-gray-300 hover:text-white">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
