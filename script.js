const ChatMessage = {
  template: '#chat-message',
  props: {
    message: {
      type: String,
      required: true
    },

    remote: {
      // Comment by Nutty7t:
      // Does the message originate from a remote source?
      type: Boolean,
      default: false
    },

    chatter: {
      // Used to grab chat image
      type: String
    },

    newChatter: {
      // TODO: Hide picture if same chatter sends multiple messages in a row
      type: Boolean,
      default: true
    },

    messageWait: {
      // How long before the next message
      type: Number,
      default: 2000 // in ms
    },

    fontSize: {
      type: Number,
      default: 14 },

    lineHeight: {
      type: Number,
      default: 1.5 // em
    } },

  data() {
    return {
      hackText: '',
      style: {
        opacity: 0 } };

    
  },
  computed: {
    // Comment by Nutty7t:
    // ------------------------------------------
    //         Message Box (remote: true)
    // ------------------------------------------
    //
    //   origin                            x - right width
    //       \ [ ---- center width ---- ]  |
    //         x----------------------- x --- x
    //       / |     <message text>     |   /
    //     /   |                        | /
    //   x --- x ---------------------- x
    //      |
    //      + - left width
    //
    messageBox() {
      return {
        origin: {
          x: this.remote ? 130 : 60,
          y: 20 },

        centerWidth: 300,
        leftWidth: 10,
        rightWidth: 20,
        slantHeight: 5,
        border: {
          normal: 4,
          left: 15,
          right: 35 } };


    },
    textOffset() {
      return {
        // Comment by Nutty7t:
        // Left padding.
        x: 15,
        // Adjust for top/bottom padding.
        y: this.messageBox.origin.y + this.fontSize * this.lineHeight / 4 };

    },
    containerPoints() {
      return [
      {
        x: this.messageBox.origin.x,
        y: this.messageBox.origin.y },

      {
        x: this.messageBox.origin.x + this.messageBox.centerWidth + this.messageBox.rightWidth,
        y: this.messageBox.origin.y },

      {
        x: this.messageBox.origin.x + this.messageBox.centerWidth,
        y: this.messageBox.origin.y + this.containerHeight + this.messageBox.slantHeight },

      {
        x: this.messageBox.origin.x - this.messageBox.leftWidth,
        y: this.messageBox.origin.y + this.containerHeight }].

      map(p => `${p.x},${p.y}`).join(' ');
    },
    containerBorderPoints() {
      return [
      {
        x: this.messageBox.origin.x - this.messageBox.border.normal,
        y: this.messageBox.origin.y - this.messageBox.border.normal },

      {
        x: this.messageBox.origin.x + this.messageBox.centerWidth + this.messageBox.border.right,
        y: this.messageBox.origin.y - this.messageBox.border.normal },

      {
        x: this.messageBox.origin.x + this.messageBox.centerWidth + this.messageBox.border.normal,
        y: this.messageBox.origin.y + this.containerHeight + this.messageBox.border.normal + this.messageBox.slantHeight },

      {
        x: this.messageBox.origin.x - this.messageBox.border.left,
        y: this.messageBox.origin.y + this.containerHeight + this.messageBox.border.normal }].

      map(p => `${p.x},${p.y}`).join(' ');
    },
    containerTailPoints() {
      return [
      {
        x: this.messageBox.origin.x - 33,
        y: this.messageBox.origin.y + this.containerHeight / 2 + 8 },

      {
        x: this.messageBox.origin.x - 17,
        y: this.messageBox.origin.y + this.containerHeight / 2 - 10 },

      {
        x: this.messageBox.origin.x - 12,
        y: this.messageBox.origin.y + this.containerHeight / 2 - 4 },

      {
        x: this.messageBox.origin.x,
        y: this.messageBox.origin.y + this.containerHeight / 2 - 10 },

      {
        x: this.messageBox.origin.x,
        y: this.messageBox.origin.y + this.containerHeight / 2 + 5 },

      {
        x: this.messageBox.origin.x - 18,
        y: this.messageBox.origin.y + this.containerHeight / 2 + 10 },

      {
        x: this.messageBox.origin.x - 22,
        y: this.messageBox.origin.y + this.containerHeight / 2 + 5 }].

      map(p => `${p.x},${p.y}`).join(' ');
    },
    containerTailBorderPoints() {
      return [
      {
        x: this.messageBox.origin.x - 40,
        y: this.messageBox.origin.y + this.containerHeight / 2 + 12 },

      {
        x: this.messageBox.origin.x - 15,
        y: this.messageBox.origin.y + this.containerHeight / 2 - 16 },

      {
        x: this.messageBox.origin.x - 12,
        y: this.messageBox.origin.y + this.containerHeight / 2 - 10 },

      {
        x: this.messageBox.origin.x,
        y: this.messageBox.origin.y + this.containerHeight / 2 - 15 },

      {
        x: this.messageBox.origin.x,
        y: this.messageBox.origin.y + this.containerHeight / 2 + 10 },

      {
        x: this.messageBox.origin.x - 20,
        y: this.messageBox.origin.y + this.containerHeight / 2 + 15 },

      {
        x: this.messageBox.origin.x - 24,
        y: this.messageBox.origin.y + this.containerHeight / 2 + 10 }].

      map(p => `${p.x},${p.y}`).join(' ');
    },
    containerHeight() {
      // Comment by Nutty7t:
      // Compute how much vertical space the message text takes up by
      // multiplying the line height by the number of lines in the message.
      let height = this.fontSize * this.lineHeight * this.wrappedMessage.length;
      // Comment by Nutty7t:
      // Now, we need to add some extra bottom padding otherwise the
      // descenders (the part of the characters beneath the baseline)
      // will get clipped. I don't know the exact height of the descender,
      // but I figure that 1/2 em should be fine. And then we'll add another
      // 1/4 em for top and bottom paddings (1/2 em in total).
      //
      //   ---
      //    |   top padding (1/4 em)
      //   ---
      //    |   text height (line height * # of lines)
      //   ---
      //    |   descender padding (1/2 em)
      //   ---
      // .  |   slanted bottom edge (this.messageBox.slantHeight)
      //   ---
      //    |   bottom padding (1/4 em)
      //   ---
      //
      return height + this.fontSize * this.lineHeight;
    },
    viewBoxHeight() {
      // Comment by Nutty7t:
      //
      //   ---
      //    |   border width
      //   ---
      //    |   container height
      //   ---
      //    |   border width
      //   ---
      //
      return this.containerHeight + this.messageBox.origin.y * 2;
    },
    primaryColor() {
      return this.remote ? 'white' : 'black';
    },
    secondaryColor() {
      return this.remote ? 'black' : 'white';
    } },

  asyncComputed: {
    wrappedMessage: {
      async get() {
        // Comment by Nutty7t:
        // Kind of a hacky way of implementing word wrapping
        // on SVG <text> elements. Not quite sure how to go
        // about determining the bounding box of some text,
        // without actually rendering it on the DOM.
        const words = this.message.split(/\s+/);
        const lines = [];
        let line = [];
        while (words.length > 0) {
          line.push(words.shift());
          this.hackText = line.join(' ');
          if ((await this.hackTextWidth()) > this.messageBox.centerWidth) {
            words.unshift(line.pop());
            lines.push({ text: line.join(' ') });
            line = [];
          }
        }
        lines.push({ text: line.join(' ') });
        if (lines.length === 1) {
          // Messages that are only one line have a fluid width.
          this.messageBox.centerWidth = (await this.hackTextWidth()) + this.textOffset.x * 2;
        }
        return lines;
      },
      default: [] } },


  methods: {
    async hackTextWidth() {
      // Wait until #hackText is rendered in the DOM.
      while (!this.$refs.hackText) {
        await Vue.nextTick();
      }
      // Wait for Vue to update the innerHTML of #hackText.
      await Vue.nextTick();
      if (this.$refs.hackText.innerHTML === this.hackText) {
        return this.$refs.hackText.clientWidth;
      } else {
        console.log(
        `[error] hackText does not have expected text\n` +
        `        expected: "${this.hackText}"\n` +
        `        actual:   "${this.$refs.hackText.innerHTML}"`);

        return 0;
      }
    } },

  mounted() {
    TweenMax.to(this.style, 1, {
      opacity: 1,
      ease: Power3.easeOut });

  } };


const ChatThread = new Vue({
  el: '#chat',
  template: '#chat-thread',
  components: { ChatMessage },
  data() {
    return {
      messages: [],
      queue: [
    //format
    //  text: what is sent  [nutty7t]
    //  chatter: who sent it [cerebralpolicy]
    //  remote: is it someone other than POV [nutty7t]
    //  messageWait: how long before next reply [cerebralpolicy]
      {
        text: "Message 1",
        chatter: 'Haru',
        remote: true,
        messageWait: 1000
      },

      {
        text: 'Message 2',
        chatter: 'Ryuji',
        remote: true, 
        messageWait: 2000
      },

      {
        text: "Message 3",
        chatter: 'Makoto',
        remote: true,
        messageWait: 1500
      },

      ],


      interval: undefined };

  },
  watch: {
    async messages(newMessages, oldMessages) {
      if (this.queue.length === 0) {
        clearInterval(this.interval);
      }
      await Vue.nextTick();
      const messages = this.$refs.chatMessages;
      const lastMessage = messages[messages.length - 1];
      // possible mechanisms?      
//    const thisMessage = messages[messages.length];
//    var delayMessage = thisMessage.messageWait;
      // display indicator someone is typing

      if (document.body !== null) {
        TweenMax.to(window, 1, { scrollTo: { y: document.body.scrollHeight }, ease: Power3.easeOut });
      }
    } },

  mounted() {
    this.interval = setInterval(() => {
      this.messages.push(this.queue.shift());
    }, 2000); // Need to pass messageWait value here
  } 
});

document.scrollingElement.scroll(0, 1);
