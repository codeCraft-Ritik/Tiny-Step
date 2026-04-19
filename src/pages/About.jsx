import { useMemo, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";
import Footer from "../components/Footer";

const navItems = ["Mission", "Tech", "Crew", "Expeditions"];

const techCards = [
  {
    title: "Routine Engines",
    text: "Our behavior-first routines reduce friction and turn small habits into repeatable wins.",
    accent: "bg-[#9ce05f]",
    stat: "STABILITY RATING: 98%"
  },
  {
    title: "Joy Sensors",
    text: "Real-time feedback loops reward effort and keep children engaged with positive reinforcement.",
    accent: "bg-[#7cc9f7]",
    stat: "DOPAMINE OPTIMIZED"
  }
];

const crew = [
  {
    name: "Commander Leo",
    role: "Mission Director",
    color: "from-[#24425c] to-[#5e8cb1]"
  },
  {
    name: "Pilot Sarah",
    role: "Navigation Expert",
    color: "from-[#18353f] to-[#60a7cb]"
  },
  {
    name: "Chief Jax",
    role: "Engine Design",
    color: "from-[#1d2f49] to-[#315f9d]"
  },
  {
    name: "Officer Maya",
    role: "Safety & Joy",
    color: "from-[#3e2a2d] to-[#d46f53]"
  }
];

const expeditions = [
  { badge: "Q3", title: "The Sleepy Comet", text: "AI lullaby generators and star-map trackers for smoother bedtime routines." },
  { badge: "Q4", title: "Chore Asteroids", text: "Turn tidy-up into a mission where children collect Dust Crystals for rewards." },
  { badge: "2026", title: "Multiverse Sync", text: "Siblings and friends join one squad to complete weekly growth challenges." }
];

const logoParticles = [
  { size: 10, color: "#ffcc28", radius: 178, duration: 8, delay: 0 },
  { size: 8, color: "#95e95c", radius: 154, duration: 6.6, delay: 0.6 },
  { size: 12, color: "#74cff7", radius: 164, duration: 7.2, delay: 1.1 },
  { size: 9, color: "#ffd565", radius: 145, duration: 6.1, delay: 0.25 }
];

const About = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const techRef = useRef(null);
  const crewRef = useRef(null);
  const brainRef = useRef(null);
  const expeditionRef = useRef(null);

  const [activeNav, setActiveNav] = useState("Mission");
  const [activeTech, setActiveTech] = useState(0);

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 86,
    damping: 24,
    mass: 0.5
  });

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const { scrollYProgress: techProgress } = useScroll({
    target: techRef,
    offset: ["start end", "end start"]
  });

  const { scrollYProgress: crewProgress } = useScroll({
    target: crewRef,
    offset: ["start end", "end start"]
  });

  const { scrollYProgress: brainProgress } = useScroll({
    target: brainRef,
    offset: ["start end", "end start"]
  });

  const { scrollYProgress: expeditionProgress } = useScroll({
    target: expeditionRef,
    offset: ["start end", "end start"]
  });

  const topOrbX = useTransform(smoothProgress, [0, 1], [-80, 220]);
  const topOrbY = useTransform(smoothProgress, [0, 1], [0, 1000]);
  const bottomOrbX = useTransform(smoothProgress, [0, 1], [0, -220]);
  const bottomOrbY = useTransform(smoothProgress, [0, 1], [0, -760]);

  const heroTextY = useTransform(heroProgress, [0, 1], [0, -44]);
  const heroImageY = useTransform(heroProgress, [0, 1], [0, 58]);
  const heroScale = useTransform(heroProgress, [0, 0.72], [1, 0.96]);

  const techY = useTransform(techProgress, [0, 1], [58, -34]);
  const crewY = useTransform(crewProgress, [0, 1], [52, -28]);
  const brainY = useTransform(brainProgress, [0, 1], [50, -26]);
  const expeditionY = useTransform(expeditionProgress, [0, 1], [56, -34]);

  const techLabel = useMemo(() => techCards[activeTech].stat, [activeTech]);

  const jumpTo = (item) => {
    setActiveNav(item);
    const map = {
      Mission: heroRef,
      Tech: techRef,
      Crew: crewRef,
      Expeditions: expeditionRef
    };

    const target = map[item]?.current;
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#e8e5cf] text-[#232018]">
      <motion.div
        style={{ x: topOrbX, y: topOrbY }}
        className="pointer-events-none fixed top-8 left-0 z-0 h-32 w-32 rounded-full bg-[#87d2ff]/45 blur-2xl"
      />
      <motion.div
        style={{ x: bottomOrbX, y: bottomOrbY }}
        className="pointer-events-none fixed right-6 bottom-16 z-0 h-32 w-32 rounded-full bg-[#d6f76f]/35 blur-2xl"
      />

      <nav className="fixed inset-x-0 top-0 z-50 border-b border-[#d8d3be] bg-[#e8e5d8e8] backdrop-blur">
        <div className="mx-auto flex h-18 w-[min(1200px,92vw)] items-center justify-between md:h-20">
          <div className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-[#3b3a2a] md:gap-3 md:text-4xl">
            <img src={Logo} alt="TinySteps logo" className="h-12 w-12 rounded-lg object-contain md:h-20 md:w-20" />
            Tiny<span className="text-[#f2a61c]">Steps</span>
          </div>

          <div className="hidden items-center gap-6 text-sm font-medium text-[#6f736f] md:flex">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => jumpTo(item)}
                className={`cursor-pointer transition ${
                  activeNav === item ? "font-semibold text-[#ea7b00]" : "hover:text-[#3f463f]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => navigate("/")}
              className="cursor-pointer rounded-full border border-[#d8d3be] bg-white px-3 py-1.5 text-xs font-bold text-[#4f523c] transition hover:-translate-y-px md:px-4 md:py-2 md:text-sm"
            >
              Home
            </button>
            <span className="rounded-full bg-[#1f231b] px-3 py-1.5 text-[11px] font-bold text-white md:text-xs">About</span>
          </div>
        </div>
      </nav>

      <section ref={heroRef} className="relative z-10 pt-24 pb-14 md:pt-28">
        <motion.div style={{ scale: heroScale }} className="mx-auto grid w-[min(1200px,92vw)] items-center gap-10 lg:grid-cols-[1.04fr_0.96fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55 }}
            style={{ y: heroTextY }}
            className="rounded-3xl bg-[#ece6dd] p-6"
          >
            <span className="inline-block rounded-full bg-[#86d2f2] px-4 py-2 text-[11px] font-bold tracking-[0.12em] text-[#1f4d62] uppercase">
              Launch sequence initiated
            </span>
            <h1 className="mt-4 text-[clamp(44px,6vw,82px)] leading-[0.95] font-black tracking-[-1.4px] text-[#2b260f]">
              Our Cosmic
              <span className="block text-[#946400]">Mission</span>
            </h1>
            <p className="mt-4 max-w-xl text-[17px] leading-[1.55] text-[#6c6a58] md:text-[21px]">
              TinySteps transforms daily routines into interstellar adventures. Every tiny step a child takes is a giant leap
              for their growing brain.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="cursor-pointer rounded-full bg-[#936300] px-6 py-3 text-sm font-extrabold text-white shadow-[0_5px_0_#715100] transition hover:-translate-y-px">
                Join the Crew
              </button>
              <button className="cursor-pointer rounded-full bg-[#e2da95] px-6 py-3 text-sm font-extrabold text-[#4d4a2e] transition hover:-translate-y-px">
                View Logs
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.58, delay: 0.08 }}
            style={{ y: heroImageY }}
            className="mx-auto max-w-xl"
          >
            <motion.div
              whileHover={{ scale: 1.02, rotateX: 3, rotateY: -4 }}
              transition={{ type: "spring", stiffness: 180, damping: 16 }}
              className="relative perspective-[1100px]"
            >
              <motion.div
                aria-hidden="true"
                animate={{ rotate: 360 }}
                transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                className="pointer-events-none absolute -inset-4 rounded-3xl border-2 border-dashed border-[#ffd86f]/75"
              />
              <motion.div
                aria-hidden="true"
                animate={{ rotate: -360 }}
                transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                className="pointer-events-none absolute -inset-7 rounded-3xl border border-[#88dbff]/45"
              />
              <motion.div
                aria-hidden="true"
                animate={{ opacity: [0.38, 0.72, 0.38], scale: [0.96, 1.06, 0.96] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
                className="pointer-events-none absolute -inset-6 rounded-3xl bg-linear-to-br from-[#5fbcff]/35 via-[#8cf390]/35 to-[#ffd66f]/38 blur-2xl"
              />

              {logoParticles.map((particle, index) => (
                <motion.div
                  key={`${particle.color}-${index}`}
                  aria-hidden="true"
                  animate={{ rotate: 360 }}
                  transition={{ duration: particle.duration, repeat: Infinity, ease: "linear", delay: particle.delay }}
                  className="pointer-events-none absolute inset-0"
                >
                  <span
                    className="absolute top-1/2 left-1/2 rounded-full"
                    style={{
                      width: `${particle.size}px`,
                      height: `${particle.size}px`,
                      backgroundColor: particle.color,
                      transform: `translate(${particle.radius}px, -50%)`,
                      boxShadow: `0 0 18px ${particle.color}`
                    }}
                  />
                </motion.div>
              ))}

              <div className="relative overflow-hidden rounded-xl border border-[#d8d3be] bg-transparent p-3 shadow-[0_16px_28px_rgba(63,72,47,0.18)]">
                <motion.div
                  aria-hidden="true"
                  animate={{ x: ["-120%", "120%"] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.7 }}
                  className="pointer-events-none absolute inset-y-0 w-1/4 rotate-12 bg-linear-to-r from-transparent via-white/25 to-transparent"
                />
                <motion.img
                  src={Logo}
                  alt="TinySteps logo"
                  animate={{ y: [0, -8, 0], scale: [1, 1.02, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="mx-auto w-3/4 object-contain mix-blend-screen"
                />
              </div>

              <motion.div
                animate={{ y: [0, -6, 0], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-3 -bottom-3 rounded-full bg-[#111a2d] px-3 py-1.5 text-[10px] font-black tracking-[0.12em] text-[#8de05f] uppercase shadow-[0_8px_18px_rgba(0,0,0,0.35)]"
              >
                Live
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <section ref={techRef} className="relative z-10 bg-[#e5e2bd] py-16">
        <motion.div style={{ y: techY }} className="mx-auto w-[min(1200px,92vw)]">
          <h2 className="text-center text-[clamp(38px,5vw,62px)] font-black tracking-[-0.8px] text-[#231e0f]">
            The Tech Behind the Magic
          </h2>
          <p className="mt-2 text-center text-base text-[#6f715f]">Powered by imagination and science</p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {techCards.map((card, index) => (
              <motion.article
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setActiveTech(index)}
                className="rounded-[28px] bg-[#efefef] p-5 shadow-[0_12px_22px_rgba(92,90,74,0.12)] md:rounded-[36px] md:p-7"
              >
                <div className={`mb-4 h-12 w-12 rounded-2xl ${card.accent}`} />
                <h3 className="text-[30px] leading-[1.02] font-extrabold text-[#1f1c14] md:text-[38px]">{card.title}</h3>
                <p className="mt-3 text-[15px] leading-[1.7] text-[#6e6e66]">{card.text}</p>
                <div className="mt-7 h-3 w-full overflow-hidden rounded-full bg-[#d9d8c4]">
                  <motion.div
                    initial={{ width: "28%" }}
                    whileInView={{ width: index === 0 ? "92%" : "68%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.12 }}
                    className={`h-full ${card.accent}`}
                  />
                </div>
                <p className="mt-2 text-[11px] font-bold tracking-[0.08em] text-[#2f4b35] uppercase">{card.stat}</p>
              </motion.article>
            ))}
          </div>

          <div className="mt-4 text-center text-xs font-black tracking-[0.14em] text-[#445447] uppercase">{techLabel}</div>
        </motion.div>
      </section>

      <section ref={crewRef} className="relative z-10 bg-[#ececee] py-16">
        <motion.div style={{ y: crewY }} className="mx-auto w-[min(1200px,92vw)]">
          <h2 className="text-center text-[clamp(38px,5vw,62px)] font-black tracking-[-0.8px] text-[#181717]">
            Meet the Ground Crew
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
            {crew.map((member, index) => (
              <motion.article
                key={member.name}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: index * 0.08 }}
                className="text-center"
              >
                <div className={`mx-auto grid h-28 w-28 place-items-center rounded-full bg-linear-to-br ${member.color} text-3xl font-black text-white shadow-[0_8px_18px_rgba(0,0,0,0.2)]`}>
                  {member.name.split(" ")[1]?.slice(0, 1) || member.name.slice(0, 1)}
                </div>
                <p className="mt-4 text-base font-extrabold text-[#1f1e1a]">{member.name}</p>
                <p className="text-[11px] font-bold tracking-[0.12em] text-[#727374] uppercase">{member.role}</p>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </section>

      <section ref={brainRef} className="relative z-10 bg-[#dfdb9a] py-16">
        <motion.div style={{ y: brainY }} className="mx-auto w-[min(1200px,92vw)]">
          <div className="grid items-start gap-6 xl:grid-cols-[1fr_0.92fr_0.92fr]">
            <article>
              <h3 className="text-[38px] leading-[1.03] font-black tracking-[-0.8px] text-[#181910] md:text-[50px]">Brain Data Pads</h3>
              <p className="mt-3 max-w-sm text-base leading-[1.65] text-[#5a5b48]">
                Access the science behind why routines help little brains explore further.
              </p>
              <div className="mt-5 rounded-2xl border border-[#b3aa63] bg-[#efe9b8] p-4">
                <p className="text-sm font-extrabold text-[#5f4b1f]">Synapse Connectivity</p>
                <p className="mt-1 text-[13px] leading-[1.6] text-[#6f6a4b]">
                  Repetition lowers decision load, helping children spend energy on what is next.
                </p>
              </div>
            </article>

            <article className="rounded-[34px] bg-[#060d06] p-6 text-white shadow-[0_14px_26px_rgba(12,17,8,0.3)]">
              <p className="text-[10px] font-black tracking-[0.14em] text-[#7ea0ff] uppercase">DP-001 // Cortisol Reduction</p>
              <p className="mt-5 text-5xl font-black text-[#89c8ff] md:text-6xl">92%</p>
              <p className="mt-4 max-w-xs text-[15px] leading-[1.6] text-[#dde4db]">
                Reduction in transition-related stress through predictable cues.
              </p>
              <div className="mt-8 flex gap-1.5">
                <span className="h-4 w-1 rounded-full bg-[#4c76ff]" />
                <span className="h-4 w-1 rounded-full bg-[#8cd3ff]" />
                <span className="h-4 w-1 rounded-full bg-[#f2ff99]" />
              </div>
            </article>

            <article className="rounded-[34px] border-4 border-[#a4ef5a] bg-[#f4f5f0] p-6 text-[#1a1c14] shadow-[0_12px_22px_rgba(85,93,58,0.15)]">
              <p className="text-[10px] font-black tracking-[0.14em] text-[#75844f] uppercase">DP-002 // Focus Boost</p>
              <h4 className="mt-7 text-[30px] leading-[1.05] font-extrabold md:text-[38px]">Executive Function Launch</h4>
              <p className="mt-3 text-[14px] leading-[1.6] text-[#666953]">
                Daily repetition strengthens the prefrontal cortex, aiding impulse control and long-term planning.
              </p>
              <div className="mt-7 h-2 w-full rounded-full bg-[#d9ddc8]">
                <div className="h-full w-[78%] rounded-full bg-linear-to-r from-[#264503] to-[#a1e25a]" />
              </div>
            </article>
          </div>
        </motion.div>
      </section>

      <section ref={expeditionRef} className="relative z-10 bg-[#d8dce3] py-16 pb-22">
        <motion.div style={{ y: expeditionY }} className="mx-auto w-[min(1200px,92vw)]">
          <h2 className="text-center text-[clamp(38px,5vw,62px)] font-black tracking-[-0.8px] text-[#191b20]">
            Galaxy Expeditions
          </h2>

          <div className="relative mx-auto mt-12 max-w-4xl">
            <div className="absolute top-4 left-1/2 h-[86%] w-1 -translate-x-1/2 rounded-full bg-[#ece5b8]" />

            <div className="grid gap-8">
              {expeditions.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.45 }}
                  transition={{ duration: 0.45, delay: index * 0.1 }}
                  className={`flex items-center gap-3 ${index % 2 === 0 ? "justify-start" : "justify-end"}`}
                >
                  {index % 2 === 0 && (
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-[#ffc92a] text-xs font-black text-[#342a00] shadow-[0_6px_14px_rgba(80,70,20,0.24)]">
                      {item.badge}
                    </span>
                  )}

                  <article className="w-[min(540px,76vw)] rounded-[30px] bg-[#e8e3c7] px-6 py-5 shadow-[0_10px_16px_rgba(90,96,105,0.12)]">
                    <h4 className="text-[26px] leading-[1.08] font-extrabold text-[#1f2225] md:text-[32px]">{item.title}</h4>
                    <p className="mt-2 text-[14px] leading-[1.6] text-[#666d71]">{item.text}</p>
                  </article>

                  {index % 2 === 1 && (
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-[#88d3ff] text-xs font-black text-[#0f3b58] shadow-[0_6px_14px_rgba(47,86,109,0.24)]">
                      {item.badge}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default About;