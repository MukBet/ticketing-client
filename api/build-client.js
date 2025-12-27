import axios from "axios";

export default ({ req }) => {
  if (typeof window === "undefined" && req) {
    // We are on the server
    return axios.create({
      // ingress-nginx-controller - service name
      // ingress-nginx - namespace
      baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });
  } else {
    // We must be on the browser
    return axios.create({
      baseURL: "/",
    });
  }
};