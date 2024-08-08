const mainMixins = {
  methods: {
    changePathWithHref(path) {
      setTimeout(() => {
        window.location.href = path
      }, 2000)
    },
  },
}

export default mainMixins
