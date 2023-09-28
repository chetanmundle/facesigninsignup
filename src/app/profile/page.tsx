"use client";
import React, { useEffect } from "react";

const Profile = () => {
  useEffect(() => {
    document.title = "Profile Page";
  }, []);
  return (
    <div>
      <div className="text-center pt-10" style={{ fontSize: "50px" }}>
        Login Successfully
      </div>
      <div className="text-center pt-10" style={{ fontSize: "50px" }}>
        Welcome
      </div>
      <div className="text-center pt-5 text-3xl">Profile Page</div>
    </div>
  );
};

export default Profile;
