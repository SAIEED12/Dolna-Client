"use client";

import { useRef, useState } from "react";

const ProductTabs = ({ tabs = [] }) => {
  const [active, setActive] = useState(0);
  const tabRefs = useRef([]);

  if (tabs.length === 0) {
    return null;
  }

  return (
    <section className="mt-14">
      <div className="border-b border-[#D8CBB4]">
        <div
          role="tablist"
          aria-label="Product information"
          className="-mb-px flex gap-6 overflow-x-auto overflow-y-hidden sm:gap-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
        {tabs.map(({ title }, i) => (
          <button
            key={title}
            ref={(el) => (tabRefs.current[i] = el)}
            type="button"
            role="tab"
            id={`product-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`product-panel-${i}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={`cursor-pointer whitespace-nowrap border-b-2 pb-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#C1633C] ${
              i === active
                ? "border-[#C1633C] text-[#2B1C14]"
                : "border-transparent text-[#6B5A4E] hover:text-[#2B1C14]"
            }`}
          >
            {title}
          </button>
        ))}
        </div>
      </div>

      <div
        role="tabpanel"
        id={`product-panel-${active}`}
        aria-labelledby={`product-tab-${active}`}
        tabIndex={0}
        className="min-h-24 font-semibold max-w-2xl pt-6 leading-relaxed text-[#6B5A4E] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C1633C]"
      >
        {tabs[active].content}
      </div>
    </section>
  );
};

export default ProductTabs;