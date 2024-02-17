import React from 'react';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link'; 
import Header from "./components/header";
import Footer from "./components/footer";



interface Shop {
  id: string;
  name: string;
  urls: Urls;
  photo: Photo;
  catch: string;
  address: string;
  open: string;
  access: string;
  budget: Budget;
}
interface Budget {
  code: string;
  name: string;
}

interface Urls {
  pc: string;
}

interface Photo {
  pc: {
    m: string;
    l: string;
  };
}

interface DetailProps {
    shop: Shop;
}

const DetailPage = ({ shop }: DetailProps) => {

  return (
    <div className='bg-white h-[100vh] flex flex-col justify-between'>
      <Head>
          <title>Detail | Near GOHAN</title>
          <meta name="description" content="Generated by create next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta http-equiv="Content-Language" content="ja"></meta>
          <link rel="icon" href="/Near.png" />
        </Head>
      <Header/>
      <main className="flex flex-col md:items-center md:justify-center max-w-[1000px] mt-[40px] mb-[40px] mx-10 lg:mx-auto p-10 border bg-gradient-to-b from-red-100 to-red-50">
        <React.Fragment>
            <Image
              src={shop.photo.pc.l}
              alt={shop.name}
              width={300}
              height={300}
            />
            <div className='flex flex-col mt-8 mb-8'>
              <p className='flex md:items-center md:justify-center text-xs text-red-600 md:text-xl'> {shop.catch}</p>
              <h1 className='text-2xl md:text-4xl font-bold'>
                <Link className='hover:underline' href={`${shop.urls.pc}`}>
                  {shop.name}
                </Link>
              </h1>
            </div>
          <div><span className='font-bold'>予算</span> : {shop.budget.name}</div>
          <div><span className='font-bold'>アクセス</span> : {shop.access}</div>
          <div><span className='font-bold'>住所</span> : {shop.address}</div>
          <div><span className='font-bold'>営業時間</span> : {shop.open}</div>
        </React.Fragment>
      </main>
      <Footer/>
    </div>
  );
}

export default DetailPage;

export async function getServerSideProps(context: any) {
  const id = context.query.id; // URLのクエリパラメータからIDを取得
  const apiKey = process.env.API_KEY;
  const baseUrl = "https://webservice.recruit.co.jp/hotpepper/gourmet/v1/";
  const format = "json";

  const res = await fetch(
    `${baseUrl}?key=${apiKey}&id=${id}&format=${format}`
  );
  const json = await res.json();
  console.log(json);
  const shop = json.results.shop[0]; // shop配列の最初の要素を取得

  return { props: { shop } }; // shopをpropsとして返す
}