"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/context/AuthContext";
import { ArrowRight, Book, BookOpenCheck, CreditCard, Database, ThumbsUp, UserCheck } from "lucide-react";
import OptChartUI from "./components/OptChartUI";
import Link from "next/link";

export default function HomePage() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };
  return (
    <main>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl md:text-6xl">
                Demystify Quantitative Finance
                <span className="block text-orange-500">
                  The Science Behind Smarter Strategies.
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Unlock the power of financial mathematics to make smarter
                investment decisions.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <Link href="/sign-up">
                  <Button className="bg-white hover:bg-gray-100 text-black border border-gray-200 rounded-full text-lg px-8 py-4 inline-flex items-center justify-center">
                    Get started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className=" mt-10 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              {/* <Terminal /> */}
              <OptChartUI />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <div>
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                <Book className="h-6 w-6" />
              </div>
              <div className="mt-5">
                <h2 className="text-lg font-medium text-gray-900">
                  Interactive Learning:
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  Explore real-world scenarios with our dynamic options
                  calculator.
                </p>
              </div>
            </div>

            <div className="mt-10 lg:mt-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                <UserCheck className="h-6 w-6" />
              </div>
              <div className="mt-5">
                <h2 className="text-lg font-medium text-gray-900">
                  User-Friendly Insights:
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  Understand the key factors influencing your trades with just a
                  few clicks.
                </p>
              </div>
            </div>

            <div className="mt-10 lg:mt-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                <ThumbsUp className="h-6 w-6" />
              </div>
              <div className="mt-5">
                <h2 className="text-lg font-medium text-gray-900">
                  Built for Everyone:
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  Whether you're new to options or a seasoned trader, our
                  platform is your guide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-gray-50">
        <div className="py-24 px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
          <div className="flex flex-col text-left basis-1/2">
            <p className="sm:text-4xl text-3xl font-extrabold text-base-content mb-8">
              Frequently Asked Questions
            </p>
            <div className="text-base-content/80">
              Have another question? Contact me on{" "}
              <a
                href="mailto:xhaxhilenzi@gmail.com"
                target="_blank"
                className="link text-base-content text-blue-500"
              >
                email
              </a>
              .
            </div>
          </div>
          <ul className="basis-1/2">
            <li>
              <button
                onClick={toggleExpand}
                className="relative flex gap-2 items-center w-full py-5 text-base font-semibold text-left border-t md:text-lg border-base-content/10"
                aria-expanded={isExpanded}
              >
                <span className="flex-1 text-base-content">
                  What is Quantitative Finance?
                </span>
                <svg
                  className={`flex-shrink-0 w-4 h-4 ml-auto fill-current transform transition-transform duration-200 ${
                    isExpanded ? "rotate-90" : ""
                  }`}
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    y="7"
                    width="16"
                    height="2"
                    rx="1"
                    className="origin-center"
                  ></rect>
                  <rect
                    y="7"
                    width="16"
                    height="2"
                    rx="1"
                    className="origin-center rotate-90"
                  ></rect>
                </svg>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isExpanded ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
                }`}
                style={{
                  maxHeight: isExpanded ? "200px" : "0px",
                  opacity: isExpanded ? 1 : 0,
                }}
              >
                <div className="pb-5 leading-relaxed">
                  <div className="space-y-4 leading-relaxed">
                    <p>
                      "At its core, quantitative finance is about understanding
                      the mathematical framework of risk and reward. Options,
                      derivatives, and hedging aren’t just tools—they’re
                      strategies to make uncertainty work for you."
                    </p>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <button
                onClick={toggleExpand}
                className="relative flex gap-2 items-center w-full py-5 text-base font-semibold text-left border-t md:text-lg border-base-content/10"
                aria-expanded={isExpanded}
              >
                <span className="flex-1 text-base-content">
                  Why Trade Options?
                </span>
                <svg
                  className={`flex-shrink-0 w-4 h-4 ml-auto fill-current transform transition-transform duration-200 ${
                    isExpanded ? "rotate-90" : ""
                  }`}
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    y="7"
                    width="16"
                    height="2"
                    rx="1"
                    className="origin-center"
                  ></rect>
                  <rect
                    y="7"
                    width="16"
                    height="2"
                    rx="1"
                    className="origin-center rotate-90"
                  ></rect>
                </svg>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isExpanded ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
                }`}
                style={{
                  maxHeight: isExpanded ? "200px" : "0px",
                  opacity: isExpanded ? 1 : 0,
                }}
              >
                <div className="pb-5 leading-relaxed">
                  <div className="space-y-4 leading-relaxed">
                    <p>
                      "Options trading gives you the flexibility to manage risk,
                      generate income, or speculate with limited downside.
                      Mastering these tools can turn market volatility into
                      opportunity."
                    </p>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <button
                onClick={toggleExpand}
                className="relative flex gap-2 items-center w-full py-5 text-base font-semibold text-left border-t md:text-lg border-base-content/10"
                aria-expanded={isExpanded}
              >
                <span className="flex-1 text-base-content">
                  Why Choose Our Calculator?
                </span>
                <svg
                  className={`flex-shrink-0 w-4 h-4 ml-auto fill-current transform transition-transform duration-200 ${
                    isExpanded ? "rotate-90" : ""
                  }`}
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    y="7"
                    width="16"
                    height="2"
                    rx="1"
                    className="origin-center"
                  ></rect>
                  <rect
                    y="7"
                    width="16"
                    height="2"
                    rx="1"
                    className="origin-center rotate-90"
                  ></rect>
                </svg>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isExpanded ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
                }`}
                style={{
                  maxHeight: isExpanded ? "200px" : "0px",
                  opacity: isExpanded ? 1 : 0,
                }}
              >
                <div className="pb-5 leading-relaxed">
                  <div className="space-y-4 leading-relaxed">
                    <p>
                      "With our intuitive options calculator, you’ll go beyond
                      simple formulas to visualize scenarios and strategies.
                      Whether you're evaluating Black-Scholes pricing or
                      exploring advanced Greeks, we make the math work for you."
                    </p>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                "In finance, as in life, uncertainty is inevitable—but
                understanding it is a choice. Make that choice today."
              </h2>
              <p className="mt-3 max-w-3xl text-lg text-gray-500">
                Start your journey into quantitative finance today. Create an
                account and see how we make complex ideas intuitive."
              </p>
            </div>
            <div className="mt-8 lg:mt-0 flex justify-center lg:justify-end">
              <a href="" target="_blank">
                <Button className="bg-white hover:bg-gray-100 text-black border border-gray-200 rounded-full text-xl px-12 py-6 inline-flex items-center justify-center">
                  View the code
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
