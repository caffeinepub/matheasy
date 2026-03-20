import { Link } from "@tanstack/react-router";
import { Calculator } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Calculator className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-extrabold">
                Math<span className="text-primary">Flow</span>
              </span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Making mathematics accessible and enjoyable for everyone,
              everywhere.
            </p>
          </div>

          {/* Learn */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/80">
              Learn
            </h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <Link
                  to="/topics"
                  className="hover:text-white transition-colors"
                >
                  All Topics
                </Link>
              </li>
              <li>
                <Link
                  to="/practice"
                  className="hover:text-white transition-colors"
                >
                  Practice
                </Link>
              </li>
              <li>
                <Link to="/quiz" className="hover:text-white transition-colors">
                  Quiz Mode
                </Link>
              </li>
            </ul>
          </div>

          {/* Topics */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/80">
              Topics
            </h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <span>Algebra</span>
              </li>
              <li>
                <span>Geometry</span>
              </li>
              <li>
                <span>Calculus</span>
              </li>
              <li>
                <span>Statistics</span>
              </li>
              <li>
                <span>Trigonometry</span>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/80">
              Account
            </h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <Link
                  to="/progress"
                  className="hover:text-white transition-colors"
                >
                  My Progress
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-white/50">
          <span>© {year} MathFlow. All rights reserved.</span>
          <span>
            Built with ❤️ using{" "}
            <a
              href={utmLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white underline transition-colors"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
