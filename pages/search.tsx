import React from 'react';
import {useState} from "react";
import { useRouter } from "next/router";
import Image from 'next/image';
import Link from 'next/link'; 
import Paginate from 'react-paginate';

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
  results_available: number;
  shop: Shop[];
}

interface HomeProps {
  results: Results;
}

const SearchPage = ({ results, lat, lng, range  }: HomeProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const router = useRouter();
  const itemsPerPage = 10;
  const data = results.shop;

  const handlePageClick = ({ selected: selectedPage }: { selected: number }) => {
    router.push({
      pathname: '/search',
      query: { 
        latitude: lat,
        longitude: lng,
        range: range,
        page: selectedPage + 1 }, // ページ番号は1から始まるため、selectedPageに1を加えます
    });
  };

  // 現在のページのデータ
  const offset = currentPage * itemsPerPage;

  // ページネーションコントロール
  const pageCount = Math.ceil(results.results_available / itemsPerPage);

    return (
        <main>
            <h1>Near GOHAN</h1>
            <p>{results.results_available}</p>
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
                <Paginate
                  previousLabel={"前"}
                  nextLabel={"次"}
                  pageCount={pageCount}
                  onPageChange={handlePageClick}
                  containerClassName={"pagination"}
                  previousLinkClassName={"pagination__link"}
                  nextLinkClassName={"pagination__link"}
                  disabledClassName={"pagination__link--disabled"}
                  activeClassName={"pagination__link--active"}
                />
            </ul>
      </main>
    );
}

export default SearchPage;

// リクエストごとに呼び出されます。
export async function getServerSideProps(context: any) {
  const apiKey = process.env.API_KEY;
  const page = context.query.page;
  const baseUrl = "https://webservice.recruit.co.jp/hotpepper/gourmet/v1/";
  const lat = context.query.latitude;
  const lng = context.query.longitude;
  // const lat = "35.6905";
  // const lng = "139.6995";
  const range = context.query.range;
  const start = (page * 10) - 9;
  const format = "json";

  // 外部APIからデータをFetchします。
  const res = await fetch(
    `${baseUrl}?key=${apiKey}&lat=${lat}&lng=${lng}&range=${range}&start=${start}&format=${format}`
  );
  const json = await res.json();
  const { results } = json;

  return { props: { results, lat, lng, range } };
}