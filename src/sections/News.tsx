"use client";

import React, { useEffect, useState } from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Skeleton } from "@/components/ui/bento-grid-demo";
import { IconFileText } from "@tabler/icons-react";

interface Article {
  title: string;
  urlToImage: string | null;
  url: string;
}

export default function News() {
  const [articles, setArticles] = useState<Article[] | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(
          `https://newsapi.org/v2/everything?q=real+estate&language=en&sortBy=publishedAt&pageSize=6&apiKey=97beaf4a6f6445c2bac4188332dba39d`
        );
        const data = await res.json();
        const filtered = data.articles.map((a: any) => ({
          title: a.title,
          urlToImage: a.urlToImage,
          url: a.url,
        }));
        setArticles(filtered);
      } catch (error) {
        console.error("Failed to fetch news:", error);
        setArticles([]);
      }
    };

    fetchNews();
  }, []);

  return (
    <section className="relative w-full py-20 overflow-hidden bg-[#0a0a0a]">
      {/* Background gradient & floating shimmer */}
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-black/60 via-black/30 to-black/60 pointer-events-none" />
      <div className="absolute w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -top-10 -left-20 animate-blob pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white text-center mb-12 px-4 md:px-0">
          Real Estate & Trading News
        </h2>

        <BentoGrid className="md:grid-cols-3 gap-6 auto-rows-fr">
          {articles
            ? articles.map((article, index) => (
                <BentoGridItem
                  key={index}
                  className="shadow-2xl border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-md"
                  header={
                    article.urlToImage ? (
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block relative overflow-hidden rounded-xl aspect-video group"
                      >
                        <img
                          src={article.urlToImage}
                          alt={article.title}
                          className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-500 group-hover:opacity-80" />
                      </a>
                    ) : (
                      <div className="aspect-video">
                        <Skeleton />
                      </div>
                    )
                  }
                  title={article.title}
                  icon={<IconFileText className="h-4 w-4 text-neutral-500" />}
                  description={undefined} 
                />
              ))
            : Array.from({ length: 6 }).map((_, i) => (
                <BentoGridItem
                  key={i}
                  className="bg-[#0F172A]/70 border border-white/10 backdrop-blur-md"
                  header={
                    <div className="aspect-video mb-4">
                      <Skeleton />
                    </div>
                  }
                />
              ))}
        </BentoGrid>
      </div>
    </section>
  );
}
