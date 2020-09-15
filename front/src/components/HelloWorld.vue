<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <textarea v-model="incoming"></textarea>
    <pre>SALIDA:{{ outgoing }}</pre>
    <button @click="submit">OK</button>
  </div>
</template>

<script>
import SimplePeer from "simple-peer";

const sp = new SimplePeer({
  initiator: location.hash === "#1",
  trickle: false
});

export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  data() {
    return {
      incoming: "",
      outgoing: ""
    };
  },
  mounted() {
    sp.on("error", err => console.log("error", err));
    sp.on("signal", data => {
      console.log("SIGNAL", JSON.stringify(data));
      this.outgoing = JSON.stringify(data);
    });
    sp.on("connect", () => {
      console.log("CONNECT");
      sp.send("whatever" + Math.random());
    });
    sp.on("data", data => {
      console.log("data: " + data);
    });
  },
  methods: {
    submit() {
      sp.signal(JSON.parse(this.incoming));
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
#outgoing {
  width: 600px;
  word-wrap: break-word;
  white-space: normal;
}
</style>
