import React from "react";
import Image from "next/image";
import { ContainerScroll } from "../../components/ui/container-scroll-animation";

function Hero() {
  return (
    <section className="bg-gray-50 flex items-center flex-col">
      <div className="flex flex-col overflow-hidden">
        <ContainerScroll
          titleComponent={
            <>
              <h1 className="text-4xl font-semibold text-black dark:text-white">
                Yapay Zeka Destekli Finans Uygulamamızla Paranızı Yönetin.{" "}
                <br />
                <span className="text-4xl md:text-[6rem] text-red-800 font-bold mt-1 leading-none">
                  Finans Asistanınız
                </span>
              </h1>
            </>
          }
        >
          <Image
            src={`/onboarding.png`}
            alt="hero"
            height={720}
            width={1400}
            className="mx-auto rounded-2xl object-cover h-full object-left-top"
            draggable={false}
          />
        </ContainerScroll>
      </div>
    </section>
  );
}

export default Hero;
