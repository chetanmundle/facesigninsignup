"use client";
import { login } from "../../services/userServices";
import React, { useEffect, useRef, useState } from "react";
import Profile from "../profile/page";
import { useRouter } from "next/navigation";
// import Image from "next/image";

import * as faceapi from "../../../node_modules//face-api.js";
import Image from "next/image";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const LoginPage = () => {
  const mycamera = useRef<HTMLVideoElement | null>(null);

  //   const router = useRouter(); // this is use for redirect
  const router = useRouter();

  //title for the page
  useEffect(() => {
    document.title = "Login Page";
  }, []);

  const [userdata, setUserdata] = useState({
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    img1: "",
    img2: "",
  });

  const [dataURL, setDataURL] = useState("");

  useEffect(() => {
    const loadFaceRecognition = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
    };

    loadFaceRecognition();

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function (stream) {
        const videoElement = mycamera.current;

        if (videoElement) {
          videoElement.srcObject = stream;
        } else {
          console.error("Video element not found.");
        }
      })
      .catch(function (error) {
        console.error("Error accessing the camera:", error);
      });
  }, []);

  //login by password
  const loginbyIdPassword = async (event: any) => {
    event.preventDefault();
    if (userdata.username.trim() === "" || userdata.username == null) {
      // toast.success("Login Success !!", {
      //   position: "top-center",
      // });
      toast.error("Please Fill Username!!");
      console.log("Username required");
      return;
    }

    if (userdata.password.trim() === "" || userdata.password == null) {
      toast.error("Please Fill Password!!");
      console.log("Password not fill");

      return;
    }

    // calling login api
    try {
      const result = await login(userdata);

      console.log(result);
      // console.log(result.user.img1);

      if (result.user.password == userdata.password) {
        router.push("/profile");
      } else {
        // alert("Username or password incorrect!!");
        Swal.fire("Password is Incorrect!!", "Please try again!", "error");
      }
      //   alert("Done");
    } catch (error) {
      console.log(error);
      // alert("Username incorrect");
      Swal.fire("Username is Incorrect!!", "Please try again!", "error");
    }
  };

  // webcam matching  face login
  const handakClickFaceButton = async (event: any) => {
    event.preventDefault();
    if (userdata.username.trim() === "" || userdata.username == null) {
      console.log("Username required");
      toast.error("Please Fill Username!!");
      return;
    }

    try {
      const result = await login(userdata);
      console.log(result);

      const binaryString = result.user.img1;

      // console.log(binaryString);
      //conver binary data to base64
      const base64String = btoa(binaryString);

      //create a data url
      const generatedDataURL = `data:image/png;base64,${base64String}`;

      // Update the state variable
      setDataURL(generatedDataURL);

      matchFaceWithWebcam();
    } catch (error) {
      console.log(error);
      Swal.fire("Username is Incorrect!!", "Please try again!", "error");
    }
  };

  async function matchFaceWithWebcam() {
    const videoElement = mycamera.current;
    // const imageElement = document.getElementById("imgdiv");
    const imageElement = document.getElementById("imgdiv") as HTMLImageElement;

    if (!imageElement) {
      console.log("Imageelement null");
    }
    if (!videoElement) {
      console.log("VideoElement null");
    }

    if (videoElement && imageElement) {
      // Detect faces in the live webcam feed
      const videoCanvas = faceapi.createCanvasFromMedia(videoElement);
      document.body.append(videoCanvas);
      const videoDisplaySize = {
        width: videoElement.width,
        height: videoElement.height,
      };
      faceapi.matchDimensions(videoCanvas, videoDisplaySize);
      const videoDetections = await faceapi
        .detectAllFaces(videoElement)
        .withFaceLandmarks()
        .withFaceDescriptors();

      // Detect faces in the existing PNG image

      const imageCanvas = faceapi.createCanvasFromMedia(imageElement);

      const imageDisplaySize = {
        width: imageElement.width,
        height: imageElement.height,
      };
      faceapi.matchDimensions(imageCanvas, imageDisplaySize);
      const imageDetections = await faceapi
        .detectAllFaces(imageElement)
        .withFaceLandmarks()
        .withFaceDescriptors();

      console.log("done");

      // // Assuming you have one face in the existing image and one in the webcam feed
      // if (imageDetections.length === 1 && videoDetections.length === 1) {
      //   const faceMatcher = new faceapi.FaceMatcher(imageDetections);
      //   const match = faceMatcher.findBestMatch(videoDetections[0].descriptor);

      //   // You can now check if the detected face in the webcam matches the existing image
      //   if (match.label === "identity_of_existing_image") {
      //     // A match is found
      //     console.log("Face matched!");
      //   } else {
      //     // No match
      //     console.log("Face not matched!");
      //   }
      // }

      // Compare the descriptors of the faces detected in the video and image
      if (videoDetections.length > 0 && imageDetections.length > 0) {
        const videoFaceDescriptor = videoDetections[0].descriptor;
        const imageFaceDescriptor = imageDetections[0].descriptor;

        // Compare the descriptors (you might use a distance threshold)
        const distance = faceapi.euclideanDistance(
          videoFaceDescriptor,
          imageFaceDescriptor
        );
        const faceMatchingThreshold = 0.5;
        if (distance < faceMatchingThreshold) {
          console.log("Face matched!");

          Swal.fire({
            position: "center",
            icon: "success",
            title: "Face Matched",
            showConfirmButton: false,
            timer: 2000,
          });

          router.push("/profile");
        } else {
          Swal.fire("Face not Match!!", "Please try again!", "error");

          console.log("Face not matched!");
        }
      } else {
        Swal.fire("Face not Faund!!", "Please try again!", "error");

        console.log("No face detected in either video or image.");
      }
    } else {
      console.log("VideoElement is null");
    }
  }

  return (
    <div>
      <div
        className="border border-blue-300 ml-80 mt-2"
        style={{ width: "600px", height: "580px" }}
      >
        <div className="bg-blue-300 grid justify-center text-3xl py-3">
          Login
        </div>
        <div className="grid mx-6 mt-5">
          <label htmlFor="username">Enter Username</label>
          <input
            type="text"
            name="username"
            className="border border-gray-400 focus:border-blue-500 px-2 py-1 rounded-md outline-none mt-1"
            value={userdata.username}
            onChange={(event) => {
              setUserdata((prevdata) => ({
                ...prevdata,
                username: event.target.value,
              }));
            }}
          />
        </div>
        <div className="grid mx-6 mt-5">
          <label htmlFor="username">Enter Password</label>
          <input
            type="password"
            name="password"
            className="border border-gray-400 focus:border-blue-500 px-2 py-1 rounded-md outline-none mt-1"
            value={userdata.password}
            onChange={(event) => {
              setUserdata((prevdata) => ({
                ...prevdata,
                password: event.target.value,
              }));
            }}
          />
        </div>

        <div className="text-center">
          <button
            className="bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-2 mt-3 rounded h-10 w-48"
            onClick={loginbyIdPassword}
          >
            Login by Passwrod
          </button>
        </div>
        <div className="text-center mt-1 text-2xl">OR</div>
        {/* div for camera */}
        <div className="grid grid-cols-2 mt-3 ml-10 mr-5 mb-5 ">
          <video
            id="camera"
            autoPlay
            ref={mycamera}
            style={{ width: "650px", height: "200px" }}
            className="border border-gray-800 border-x-2"
          ></video>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold  rounded h-14 w-40 ml-20 mt-20"
            onClick={handakClickFaceButton}
          >
            Login By Face
          </button>
        </div>

        {/* div for new user url */}
        <div className="text-center pt-2 ">
          Not a Memner?{" "}
          <a href="/signin" className="text-blue-900 font-semibold">
            Signup here
          </a>
        </div>
      </div>

      <div className="w-32 h-32 bg-slate-500" style={{ display: "none" }}>
        <Image
          id="imgdiv"
          src={dataURL}
          alt="User Profile Image"
          width={300}
          height={200}
        />
      </div>
    </div>
  );
};

export default LoginPage;
