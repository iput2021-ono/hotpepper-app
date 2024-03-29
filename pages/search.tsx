import React from 'react';
import Head from 'next/head';
import {useState} from "react";
import { useRouter } from "next/router";
import Image from 'next/image';
import Link from 'next/link'; 
import Paginate from 'react-paginate';
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
  };
}

interface Results {
  results_available: number;
  shop: Shop[];
}

interface HomeProps {
  results: Results;
  lat: number;
  lng: number;
  range: number;
  genre: string;
  budget: string;
}

const SearchPage = ({ results, lat, lng, range, genre, budget }: HomeProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const itemsPerPage = 10;
  const data = results.shop;

  const handlePageClick = ({ selected: selectedPage }: { selected: number }) => {
    setCurrentPage(selectedPage + 1 );
    router.push({
      pathname: '/search',
      query: { 
        latitude: lat,
        longitude: lng,
        range: range,
        page: selectedPage + 1,
        genre: genre,
        budget: budget}, 
    });
  };

  // ページネーションコントロール
  const pageCount = Math.ceil(results.results_available / itemsPerPage);

    return (
      <div>
        <Head>
          <title>Search | Near GOHAN</title>
          <meta name="description" content="Generated by create next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta http-equiv="Content-Language" content="ja"></meta>
          <link rel="icon" href="/Near.png" />
        </Head>
        <Header/>
        <main className="flex flex-col flex-grow bg-white text-black">
          <div className="max-w-[1000px] mt-[80px] mb-[100px] mx-8 lg:mx-auto">
            <p>{results.results_available}件 ( {currentPage} / {pageCount}ページ )</p>
            <ul>
                {results.shop.map((data) => {
                    return (
                      <div key={data.id} className='rounded-xl shadow-xl p-4 lg:p-8 border bg-amber-50 border-green-600 mt-2 mb-6'>
                        <div className=''>
                          <li key={data.id} className="flex flex-col items-center justify-center md:flex-row md:items-start">
                            <div className="w-full flex justify-center md:w-auto md:min-w-fit md:min-h-fit md:max-w-fit md:max-h-fit">
                              <Image
                                src={data.photo.pc.m}
                                alt={data.name}
                                width={168}
                                height={168}
                                className="object-cover "
                              />
                            </div>
                            <div className="flex-grow p-2">
                              <div className='text-xs text-red-500 md:text-bace'>{data.catch}</div>
                              <h3 className="text-xl font-bold mb-4 md:mb-0">
                                <Link className='hover:underline' href={`/${data.id}`}>
                                  {data.name}
                                </Link>
                              </h3>
                              <div className='text-sm md:text-bace'>予算：{data.budget.name}</div>
                              <div className='text-sm md:text-bace'>営業時間：{data.open}</div>
                              <div className='text-sm md:text-bace'>アクセス：{data.access}</div>
                            </div>
                          </li>
                        </div>
                      </div>
                    );
                })}
                <div className="">
                  <Paginate className='flex justify-between text-4xl mx-4'
                    previousLabel={"<"}
                    nextLabel={">"}
                    pageCount={pageCount}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={1}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    previousLinkClassName={"pagination__previous"}
                    nextLinkClassName={"pagination__next"}
                    disabledClassName={"pagination__disabled"}
                  />
                </div>
            </ul>
          </div>
            
        </main>
        <Footer/>
      </div>  
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
  const genre = context.query.genre || "";
  const budget = context.query.budget || "";
  const format = "json";

  // 外部APIからデータをFetchします。
  const res = await fetch(
    `${baseUrl}?key=${apiKey}&lat=${lat}&lng=${lng}&range=${range}&start=${start}&budget=${budget}&genre=${genre}&format=${format}`
  );
  const json = await res.json();
  const { results } = json;

  return { props: { results, lat, lng, range, genre, budget } };
}