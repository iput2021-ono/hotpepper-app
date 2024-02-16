import React from 'react';
import Image from 'next/image';
import Header from "./components/header.tsx";

interface Shop {
  id: string;
  name: string;
  address: string;
  open: string;
  photo: {
    pc: {
      m: string;
    };
  };
};

interface DetailProps {
    shop: Shop[];
}

const DetailPage = ({ shop }: DetailProps) => {

  return (
    <div>
      <Header/>
      <main>
        <React.Fragment>
          <h1>{shop.name}</h1>
          <Image
            src={shop.photo.pc.m}
            alt={shop.name}
            width={500} // 画像の幅を適切に設定
            height={500} // 画像の高さを適切に設定
          />
          <div>{shop.catchCopy}</div>
          <div>{shop.address}</div>
          <div>営業時間：{shop.open}</div>
          // Other details...
        </React.Fragment>
      </main>
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