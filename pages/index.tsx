import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [radius, setRadius] = useState<number>(3);

  // useEffect(() => {
  //   getCurrentLocation();
  // }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleSearch = () => {
    router.push({
      pathname: '/search',
      query: {
        latitude: latitude,
        longitude: longitude,
        range: radius,
        page: 1
      }
    });
  }

  return (
  <div className="bg-[url(/dishes.jpg)] h-[100vh] flex flex-col justify-between">
    <Head>
      <title>Near GOHAN</title>
      <meta name="description" content="Generated by create next app" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main className="flex flex-col items-center justify-center flex-grow">
      <div className="flex flex-col items-center rounded-lg bg-white/[0.9] px-5 lg:px-20 py-10">
        <h1 className="text-6xl font-bold mb-4 text-black">Near GOHAN</h1>
        <p className="text-[18px] lg:text-[24px] mb-4 text-black">近くのお店をサクッと検索</p>
        <div className="space-x-4">
          {/* <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={getCurrentLocation}>現在地取得</button> */}
          <select className="select text-black max-w-xs px-4 py-2 rounded shadow" value={radius} onChange={(e) => setRadius(Number(e.target.value))}>
            <option disabled selected>検索半径</option>
            <option value="1">300m</option>
            <option value="2">500m</option>
            <option value="3">1000m</option>
            <option value="4">2000m</option>
            <option value="5">3000m</option>
          </select>
          <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleSearch}>検索</button>
        </div>
      </div>
    </main>
    <footer className="footer p-4 bg-green-700 text-base-content text-center">
      Powered by <a className="text-blue-200" href="http://webservice.recruit.co.jp/">ホットペッパーグルメ Webサービス</a>
    </footer>
  </div>
    
);
}
