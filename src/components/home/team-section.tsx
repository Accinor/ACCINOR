"use client"

import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { X, LinkedIn, Dribbble } from "@/components/foundations/social-icons"
import { motion } from "framer-motion"

const teamMembers = [
  {
    name: "Amélie Laurent",
    title: "Founder & CEO",
    avatarUrl: "https://www.untitledui.com/images/avatars/amelie-laurent?fm=webp&q=80",
    socials: [X, LinkedIn, Dribbble],
  },
  {
    name: "Nikolas Gibbons",
    title: "Engineering Manager",
    avatarUrl: "https://www.untitledui.com/images/avatars/nikolas-gibbons?fm=webp&q=80",
    socials: [X, LinkedIn, Dribbble],
  },
  {
    name: "Sienna Hewitt",
    title: "Product Manager",
    avatarUrl: "https://www.untitledui.com/images/avatars/sienna-hewitt?fm=webp&q=80",
    socials: [X, LinkedIn, Dribbble],
  },
  {
    name: "Lily-Rose Chedjou",
    title: "Frontend Developer",
    avatarUrl: "https://www.untitledui.com/images/avatars/lily-rose-chedjou?fm=webp&q=80",
    socials: [X, LinkedIn, Dribbble],
  },
  {
    name: "Zahra Christensen",
    title: "Backend Developer",
    avatarUrl: "https://www.untitledui.com/images/avatars/zahra-christensen?fm=webp&q=80",
    socials: [X, LinkedIn, Dribbble],
  },
  {
    name: "Caitlyn King",
    title: "Product Designer",
    avatarUrl: "https://www.untitledui.com/images/avatars/caitlyn-king?fm=webp&q=80",
    socials: [X, LinkedIn, Dribbble],
  },
  {
    name: "Zaid Schwartz",
    title: "UX Researcher",
    avatarUrl: "https://www.untitledui.com/images/avatars/zaid-schwartz?fm=webp&q=80",
    socials: [X, LinkedIn, Dribbble],
  },
  {
    name: "Marco Kelly",
    title: "Customer Success",
    avatarUrl: "https://www.untitledui.com/images/avatars/marco-kelly?fm=webp&q=80",
    socials: [X, LinkedIn, Dribbble],
  },
]

export function TeamSection() {
  return (
    <section className="py-16 md:py-24 bg-section">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
          <span className="text-sm font-semibold text-[#ffb81b] md:text-base">We&apos;re hiring!</span>
          <h2 className="mt-3 text-3xl font-bold text-section-foreground md:text-4xl">Meet our team</h2>
          <p className="mt-4 text-lg text-section-foreground/60 md:mt-5 md:text-xl">
            Our philosophy is simple—hire a team of diverse, passionate people and foster a culture that empowers you to do your best work.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ul className="mt-12 md:mt-16 grid w-full grid-cols-1 justify-items-center gap-x-8 gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {teamMembers.map((item) => (
              <li key={item.name} className="flex flex-col items-center gap-4 md:gap-5">
                <Avatar className="size-20 md:size-24">
                  <AvatarImage src={item.avatarUrl} alt={item.name} />
                </Avatar>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-section-foreground">{item.name}</h3>
                  <p className="text-sm text-[#ffb81b]">{item.title}</p>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    {item.socials.map((Icon, i) => (
                      <a
                        key={i}
                        href="#"
                        className="p-1.5 text-section-foreground/30 hover:text-[#ffb81b] transition-colors duration-200"
                        aria-label={`${item.name} social link ${i + 1}`}
                      >
                        <Icon className="size-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}
