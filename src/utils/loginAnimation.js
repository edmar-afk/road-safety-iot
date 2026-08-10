import { easeOut } from "framer-motion";

const loginAnimation = {
  page: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: {
      duration: 0.6,
    },
  },

  leftPanel: {
    initial: { x: -80, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: {
      duration: 0.8,
      ease: easeOut,
    },
  },

  form: {
    initial: {
      x: 80,
      opacity: 0,
      scale: 0.97,
    },
    animate: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    transition: {
      duration: 0.8,
      delay: 0.2,
      ease: easeOut,
    },
  },

  title: {
    initial: {
      y: 20,
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
    },
    transition: {
      duration: 0.5,
      delay: 0.4,
    },
  },

  input: (delay = 0) => ({
    initial: {
      y: 20,
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
    },
    transition: {
      duration: 0.4,
      delay,
    },
  }),

  button: {
    whileHover: {
      scale: 1.02,
      y: -2,
    },
    whileTap: {
      scale: 0.98,
    },
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 18,
    },
  },

  floatingTop: {
    animate: {
      y: [0, -20, 0],
    },
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },

  floatingBottom: {
    animate: {
      y: [0, 20, 0],
    },
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default loginAnimation;