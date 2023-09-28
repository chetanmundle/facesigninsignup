"use client";
import { signUp } from "@/services/userServices";
import { useRouter } from "next/navigation";

import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const SigninPage = () => {
  //ref of camera
  const mycamera = useRef<HTMLVideoElement | null>(null);
  // const captureButton = useRef<HTMLVideoElement | null>(null);
  const captureButton = useRef(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const router = useRouter();


  //title for the page 
  useEffect(() => {
    document.title = "Signin Page";
  }, []);

  useEffect(() => {
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

  const [userdata, setUserdata] = useState({
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    img1: "",
    img2: "",
  });

  async function captureButtonClick(event: any) {
    event.preventDefault();
    const canvas = canvasRef.current;

    if (canvas) {
      const videoElement = mycamera.current;
      const context = canvas.getContext("2d");

      if (context && videoElement) {
        // You can now use the 'context' to draw on the canvas
        // For example:
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;

        // Draw the current frame from the video onto the canvas
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        // Convert the canvas image to a data URL (PNG format)

        const capturedImage = canvas.toDataURL("image/png");
        const base64String = capturedImage.split(",")[1];
        const binaryString = atob(base64String);
        console.log(binaryString);

        setUserdata((prevdata) => ({
          ...prevdata,
          img1: binaryString,
        }));

        toast.success("Image Capture Successfully");
        console.log(userdata);

        {
          // this is for dowinload the img
          // const downloadLink = document.createElement("a");
          // downloadLink.href = capturedImage;
          // downloadLink.download = "captured-image.png";
          // Trigger a click event on the download link to save the image
          // downloadLink.click();
        }
      } else {
        console.error("Canvas context not found.");
      }
    } else {
      console.error("Canvas element not found.");
    }
  }

  // handalsubmit
  const handalSubmit = async (event: any) => {
    event.preventDefault();

    if (userdata.username.trim() === "" || userdata.username == null) {
      console.log("Username required");
      toast.error("Please Fill Username!!");
      return;
    }

    if (userdata.password.trim() === "" || userdata.password == null) {
      console.log("password Required");
      toast.error("Please Fill Password!!");
      return;
    }

    if (userdata.img1.trim() === "" || userdata.img1 == null) {
      console.log("Image Required");
      toast.error("Please Capture a image!!");
      return;
    }

    try {
      const result = await signUp(userdata);
      setUserdata({
        firstname: "",
        lastname: "",
        username: "",
        password: "",
        img1: "",
        img2: "",
      });
      console.log(result);

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Signin Successfuly",
        showConfirmButton: false,
        timer: 2000,
      });

      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div
        className="border border-blue-300 ml-80"
        style={{ width: "600px", height: "550px" }}
      >
        <div className="bg-blue-400 grid justify-center text-3xl py-4">
          Signin
        </div>
        <form onSubmit={handalSubmit}>
          <div className="grid grid-cols-2 ml-7 mt-2">
            <div className="grid mr-12 ">
              <label htmlFor="firstname">First Name</label>
              <input
                className="border border-gray-400 focus:border-blue-500 px-2 py-1 rounded-md outline-none"
                type="text"
                name="firstname"
                id="firstname"
                value={userdata.firstname}
                onChange={(event) => {
                  setUserdata((prevdata) => ({
                    ...prevdata,
                    firstname: event.target.value,
                  }));
                }}
              />
            </div>
            <div className="grid mr-12">
              <label htmlFor="lastname">Last Name</label>
              <input
                className="border border-gray-400 focus:border-blue-500 px-2 py-1 rounded-md outline-none"
                type="text"
                name="lastname"
                id="lastname"
                value={userdata.lastname}
                onChange={(event) => {
                  setUserdata((prevdata) => ({
                    ...prevdata,
                    lastname: event.target.value,
                  }));
                }}
              />
            </div>
          </div>
          {/* username and password */}
          <div className="grid grid-cols-2 ml-7 mt-4">
            <div className="grid mr-12">
              <label htmlFor="username">Username</label>
              <input
                className="border border-gray-400 focus:border-blue-500 px-2 py-1 rounded-md outline-none"
                type="text"
                name="username"
                id="username"
                value={userdata.username}
                onChange={(event) => {
                  setUserdata((prevdata) => ({
                    ...prevdata,
                    username: event.target.value,
                  }));
                }}
              />
            </div>
            <div className="grid mr-12">
              <label htmlFor="password">Password</label>
              <input
                className="border border-gray-400 focus:border-blue-500 px-2 py-1 rounded-md outline-none"
                type="password"
                name="password"
                id="password"
                value={userdata.password}
                onChange={(event) => {
                  setUserdata((prevdata) => ({
                    ...prevdata,
                    password: event.target.value,
                  }));
                }}
              />
            </div>
          </div>

          

          {/* div for captur a camera */}
          <div className="grid grid-cols-2 m-5 ml-8">
            <video
              id="camera"
              autoPlay
              ref={mycamera}
              style={{ width: "640px", height: "200px" }}
              className="border border-gray-600 border-x-4"
            ></video>
            <button
              ref={captureButton}
              onClick={captureButtonClick}
              className="bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded h-14 w-40 ml-20 mt-20"
            >
              Capture
            </button>
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
          </div>
          <div className="text-center">
            <button className="bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded h-10 w-32">
              Signin
            </button>
          </div>
        </form>
        <div className="text-center pt-2 mt-2 ">
          Already a Member? <a href="/login" className="text-blue-900 font-semibold">Log In</a>
        </div>
      </div>
      {/* {JSON.stringify(userdata)} */}
    </div>
  );
};

export default SigninPage;

function converToBase64(file: any) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}
