import { useState } from 'react';
import { useRouter } from "next/router";
import Link from 'next/link';
import Image from 'next/image';

interface Results {
  results_available: number;
  results_returned: string;
  results_start: number;
  shop: ShopData[];
}

interface ShopData {
  id: string;
  photo: { pc: { m: string } };
  name: string;
  address: string;
  open: string;
  catch: string;
}

interface HomeProps {
  results: Results;
}

const SearchPage = ({ results }: HomeProps) => {
  const router = useRouter();
  const totalResults = results.results_available;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  let currentItems: ShopData[] = [];
  let totalPage = 0;

  if (results && Array.isArray(results.shop)) {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    currentItems = results.shop.slice(indexOfFirstItem, indexOfLastItem);

    totalPage = Math.ceil(results.shop.length / itemsPerPage);
  }

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    router.push({
      pathname: '/search',
      query: { page: pageNumber },
    });
  };

  return (
    <main>
      <h1>Near GOHAN</h1>
      <div>ページ: {currentPage} / {totalPage}</div>
      <ul>
        {currentItems.map((data: ShopData) => {
          return (
            <li key={data.id}>
              <Link href={`/${data.id}`}>
                <Image
                  src={data.photo.pc.m}
                  alt={data.name}
                  width={168}
                  height={168}
                />
              </Link>
              <div>{data.catch}</div>
              <h3>
                <Link href={`/${data.id}`}>
                  {data.name}
                </Link>
              </h3>
              <div>{data.address}</div>
              <div>営業時間：{data.open}</div>
            </li>
          );
        })}
      </ul>
      <div>
        {currentPage > 1 && <button onClick={() => paginate(currentPage - 1)}>前へ</button>}
        {[...Array(totalPage).keys()].map((number) => {
          return (
            <button key={number} onClick={() => paginate(number + 1)}>
              {number + 1}
            </button>
          );
        })}
        {currentPage < totalPage && <button onClick={() => paginate(currentPage + 1)}>次へ</button>}
      </div>
    </main>
  );
};

export default SearchPage;

// リクエストごとに呼び出されます。
export async function getServerSideProps(context: any) {
  const apiKey = process.env.API_KEY;
  const baseUrl = "https://webservice.recruit.co.jp/hotpepper/gourmet/v1/";
  const lat = "35.6905"
  const lng = "139.6995"
  const range = context.query.range;
  const format = "json";

  // ページ数を取得し、それを基に開始位置を計算します。
  const page = context.query.page ? Number(context.query.page) : 1;
  const start = page * 10 - 9;

  // 外部APIからデータをFetchします。
  const res = await fetch(
    `${baseUrl}?key=${apiKey}&lat=${lat}&lng=${lng}&range=${range}&start=${start}&format=${format}`
  );
  const json = await res.json();
  const results = json;

  // console.log(JSON.stringify(results, null, 2));
  // 上の方にあるHomeにpropsとしてデータが渡されます。
  return { props: { results } };
}