import React from 'react';
import Image from 'next/image';
import Link from 'next/link'; 

interface Urls {
  pc: string;
}

interface Photo {
  pc: {
    m: string;
  };
}

interface Shop {
  id: string;
  name: string;
  urls: Urls;
  photo: Photo;
  catch: string;
  address: string;
  open: string;
}

interface Results {
  shop: Shop[];
}

interface HomeProps {
  results: Results;
}

// const SearchPage = ({ results }: HomeProps) => {
//     return (
//         <main>
//             <h1>Near GOHAN</h1>
//             <ul>
//                 {results.shop.map((data, i) => {
//                     return (
//                     <li key={i}>
//                         <a href={data.urls.pc}>
//                         <Image
//                             src={data.photo.pc.m}
//                             alt={data.name}
//                             width={168}
//                             height={168}
//                         />
//                         </a>
//                         <div>{data.catch}</div>
//                         <h3>
//                         <a href={data.urls.pc}>{data.name}</a>
//                         </h3>
//                         <div>{data.address}</div>
//                         <div>営業時間：{data.open}</div>
//                     </li>
//                     );
//                 })}
//             </ul>
//       </main>
//     );
// }

const SearchPage = ({ results }: HomeProps) => {
    return (
        <main>
            <h1>Near GOHAN</h1>
            <ul>
                {results.shop.map((data) => {
                    return (
                    <li key={data.id}>
                        <Link href={`/${data.id}`}> {/* 各店舗の詳細ページへのリンクを設定 */}
                            <a>
                            <Image
                                src={data.photo.pc.m}
                                alt={data.name}
                                width={168}
                                height={168}
                            />
                            </a>
                        </Link>
                        <div>{data.catch}</div>
                        <h3>
                        <Link href={`/${data.id}`}> {/* 各店舗の詳細ページへのリンクを設定 */}
                            <a>{data.name}</a>
                        </Link>
                        </h3>
                        <div>{data.address}</div>
                        <div>営業時間：{data.open}</div>
                    </li>
                    );
                })}
            </ul>
      </main>
    );
}

export default SearchPage;

// リクエストごとに呼び出されます。
export async function getServerSideProps(context: any) {
  const apiKey = process.env.API_KEY;
  //const apiKey = `5559737a27c2ec12`
  const baseUrl = "https://webservice.recruit.co.jp/hotpepper/gourmet/v1/";
  const lat = context.query.latitude;
  const lng = context.query.longitude;
  const range = context.query.range;
  const format = "json";

  // 外部APIからデータをFetchします。
  const res = await fetch(
    `${baseUrl}?key=${apiKey}&lat=${lat}&lng=${lng}&range=${range}&format=${format}`
  );
  const json = await res.json();
  const { results } = json;

  // 上の方にあるHomeにpropsとしてデータが渡されます。
  return { props: { results } };
}