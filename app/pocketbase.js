import PocketBase from "pocketbase";

const pb = new PocketBase("http://127.0.0.1:8090");
console.log(pb);
pb.autoCancellation(false);

export default pb;
