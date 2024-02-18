import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from 'react';
import Header from "./components/header";
import Footer from "./components/footer";

export default function Home() {
  const router = useRouter();
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [radius, setRadius] = useState<number>(3);
  const [budget, setBudget] = useState<string | null>(null);
  const [genre, setGenre] = useState<string | null>(null);

  // useEffect(() => {
  //   getCurrentLocation();
  // }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            alert('位置情報の提供が拒否されました。設定を確認してください。');
          }
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleSearch = () => {
    if (latitude === null || longitude === null) {
      alert('現在地が取得されていません。');
    } else {
      router.push({
        pathname: '/search',
        query: {
          latitude: latitude,
          longitude: longitude,
          range: radius,
          page: 1,
          budget: budget,
          genre: genre
        }
      });
    }
  }

  return (
  <div className="bg-[url(/dishes.jpg)] h-[100vh] flex flex-col justify-between">
    <Head>
      <title>Near GOHAN</title>
      <meta name="description" content="Generated by create next app" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta http-equiv="Content-Language" content="ja"></meta>
      <link rel="icon" href="/Near.png" />
    </Head>
    <Header/>
    <main className="flex flex-col items-center justify-center flex-grow">
      <div className="flex flex-col items-center rounded-lg bg-white/[0.9] px-5 lg:px-20 py-10">
        <h1 className="text-4xl lg:text-6xl font-bold mb-4 text-black"><span className="text-red-500 text-6xl lg:text-8xl italic">N</span>ear GOHAN</h1>
        <p className="text-[18px] lg:text-[24px] mb-4 text-black">近くのお店をサクッと検索</p>
        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
        {/* {(latitude === null || longitude === null) && (
          <button className="px-4 py-2 bg-red-500 text-white rounded shadow" onClick={getCurrentLocation}>現在地取得</button>
        )} */}
          <select className="select text-black max-w-xs px-4 py-2 rounded shadow" value={budget ?? ''} onChange={(e) => setBudget(e.target.value)}>
            <option value="">全ての予算</option>
            <option value="B009">~500円</option>
            <option value="B010">501~1000円</option>
            <option value="B011">1001~1500円</option>
            <option value="B001">1501~2000円</option>
            <option value="B002">2001~3000円</option>
            <option value="B003">3001~4000円</option>
            <option value="B008">4001~5000円</option>
            <option value="B004">5001~7000円</option>
            <option value="B005">7001~10000円</option>
            <option value="B006">10001~15000円</option>
            <option value="B012">15001~20000円</option>
            <option value="B013">20001~30000円</option>
            <option value="B014">30001円~</option>
          </select>
          <select className="select text-black max-w-xs px-4 py-2 rounded shadow" value={genre ?? ''} onChange={(e) => setGenre(e.target.value)}>
            <option value="">全てのジャンル</option>
            <option value="G001">居酒屋</option>
            <option value="G002">ダイニングバー・バル</option>
            <option value="G003">創作料理</option>
            <option value="G004">和食</option>
            <option value="G005">洋食</option>
            <option value="G006">イタリアン・フレンチ</option>
            <option value="G007">中華</option>
            <option value="G008">焼肉・ホルモン</option>
            <option value="G017">韓国料理</option>
            <option value="G009">アジア・エスニック料理</option>
            <option value="G010">各国料理</option>
            <option value="G011">カラオケ・パーティ</option>
            <option value="G012">バー・カクテル</option>
            <option value="G013">ラーメン</option>
            <option value="G016">お好み焼き・もんじゃ</option>
            <option value="G014">カフェ・スイーツ</option>
            <option value="G015">その他グルメ</option>
          </select>
          <select className="select text-black max-w-xs px-4 py-2 rounded shadow" value={radius} onChange={(e) => setRadius(Number(e.target.value))}>
            <option disabled selected>検索半径</option>
            <option value="1">300m</option>
            <option value="2">500m</option>
            <option value="3">1000m</option>
            <option value="4">2000m</option>
            <option value="5">3000m</option>
          </select>
          <button className="px-4 py-2 bg-red-500 text-white rounded shadow" onClick={handleSearch}>検索</button>
        </div>
      </div>
    </main>
    <Footer/>
  </div>
    
);
}
