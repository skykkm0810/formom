import React, { useEffect, useState } from "react";
import "./App.css";
import Dialog from "@mui/material/Dialog";
import axios from "axios";
import {
  getDoc,
  doc,
  getFirestore,
  setDoc,
  addDoc,
  collection,
} from "firebase/firestore/lite";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebase";

export interface product {
  id?: number;
  productName: string;
  numbersByDay: {
    mon: number;
    tue: number;
    wen: number;
    thr: number;
    fri: number;
    sat: number;
  };
}
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const profileRef = doc(db, "data", "allList");
function App() {
  const [show, setShow] = useState<number>(0);
  const [modal, setModal] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);
  const [modalType, setModalType] = useState<number>(0);
  const [modalData, setModalData] = useState<product>();
  const modalHandler = (data: product, type: number) => {
    setModalType(type);
    setModal(true);
    setModalData(data);
  };
  const handleClose = () => {
    setModal(false);
  };
  const [products, setProducts] = useState<Array<product>>();
  // 읽기
  const getProducts = async () => {
    const docSnap = await getDoc(profileRef);
    setProducts(docSnap.get("products"));
  };
  useEffect(() => {
    getProducts();
  }, []);
  //  만들기
  const createProduct = async () => {
    var prd_name = document.getElementsByName(
      "prd_name"
    )[0] as HTMLInputElement;
    var mon_number = document.getElementsByName(
      "mon_number"
    )[0] as HTMLInputElement;
    var tue_number = document.getElementsByName(
      "tue_number"
    )[0] as HTMLInputElement;
    var wen_number = document.getElementsByName(
      "wen_number"
    )[0] as HTMLInputElement;
    var thr_number = document.getElementsByName(
      "thr_number"
    )[0] as HTMLInputElement;
    var fri_number = document.getElementsByName(
      "fri_number"
    )[0] as HTMLInputElement;
    var sat_number = document.getElementsByName(
      "sat_number"
    )[0] as HTMLInputElement;
    const newIndex = Number(products?.slice(-1)[0].id) + 1;
    const newValue: product = {
      id: newIndex,
      productName: prd_name?.value,
      numbersByDay: {
        mon: Number(mon_number?.value),
        tue: Number(tue_number?.value),
        wen: Number(wen_number?.value),
        thr: Number(thr_number?.value),
        fri: Number(fri_number?.value),
        sat: Number(sat_number?.value),
      },
    };
    products?.push(newValue);
    try {
      const docRef = await setDoc(
        doc(db, "data", "allList"),
        { products },
        {
          merge: true,
        }
      );
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };
  // 변경
  const updateProducts = async () => {
    var prd_name = document.getElementsByName(
      "prd_name"
    )[0] as HTMLInputElement;
    var mon_number = document.getElementsByName(
      "mon_number"
    )[0] as HTMLInputElement;
    var tue_number = document.getElementsByName(
      "tue_number"
    )[0] as HTMLInputElement;
    var wen_number = document.getElementsByName(
      "wen_number"
    )[0] as HTMLInputElement;
    var thr_number = document.getElementsByName(
      "thr_number"
    )[0] as HTMLInputElement;
    var fri_number = document.getElementsByName(
      "fri_number"
    )[0] as HTMLInputElement;
    var sat_number = document.getElementsByName(
      "sat_number"
    )[0] as HTMLInputElement;
    const newValue: product = {
      id: index,
      productName: prd_name?.value,
      numbersByDay: {
        mon: Number(mon_number?.value),
        tue: Number(tue_number?.value),
        wen: Number(wen_number?.value),
        thr: Number(thr_number?.value),
        fri: Number(fri_number?.value),
        sat: Number(sat_number?.value),
      },
    };

    if (products) {
      var copy: product[] = [...products];
      const evenIndex: number = copy.findIndex(
        (el: product) => el.id === index
      );
      copy[evenIndex] = newValue;
      console.log(index, copy, copy[index]);
      try {
        const docRef = await setDoc(
          doc(db, "data", "allList"),
          { products: copy },
          {
            merge: true,
          }
        );
        console.log(docRef);
        alert("변경이 완료되었습니다.");
        window.location.reload();
      } catch (err) {
        console.log(err);
        alert("에러가 발생했습니다.");
        handleClose();
      }
    }
  };
  // 삭제
  const deleteProducts = async () => {
    if (products) {
      var copy = [...products];
      const newArr = copy.filter((list) => list.id !== index);
      try {
        const docRef = await setDoc(
          doc(db, "data", "allList"),
          { products: newArr },
          {
            merge: true,
          }
        );
        alert("삭제가 완료되었습니다.");
        window.location.reload();
      } catch (err) {
        console.log(err);
        alert("에러가 발생했습니다.");
        handleClose();
      }
    }
  };
  return (
    <div className="App">
      <div className="p-4">
        {/* <button
          onClick={() => {
            setShow(0);
          }}
          className={`w-48 py-2 border ${show == 0 ? `bg-orange-300` : "bg-slate-200"} rounded-l-md`}
        >
          전체 보기
        </button> */}
        <button
          // onClick={() => {
          //   setShow(1);
          // }}
          className={`w-80 py-2 border ${show == 0 ? `bg-slate-200` : "bg-orange-300"} rounded-md`}
        >
          제품 별 수량
        </button>
      </div>
      <div className="flex justify-end px-4 max-w-[1440px] mx-auto">
        <button
          onClick={() => {
            var defaultValue: product = {
              productName: "",
              numbersByDay: {
                mon: 0,
                tue: 0,
                wen: 0,
                thr: 0,
                fri: 0,
                sat: 0,
              },
            };
            modalHandler(defaultValue, 0);
          }}
          className={`w-24 py-2 border bg-blue-300 rounded-md`}
        >
          추가하기
        </button>
      </div>
      <div className="pt-5 pb-10 px-4 w-full overflow-auto flex justify-center">
        <table className="table-auto w-full max-w-[1440px]">
          <thead>
            <tr className="bg-slate-200 border-b">
              <th>제품</th>
              <th className="min-w-10 bg-red-200">월</th>
              <th className="min-w-10 bg-orange-200">화</th>
              <th className="min-w-10 bg-green-300">수</th>
              <th className="min-w-10 bg-cyan-500">목</th>
              <th className="min-w-10 bg-blue-300">금</th>
              <th className="min-w-10 bg-purple-300">토</th>
            </tr>
          </thead>
          <tbody className="border-b border-black">
            {products &&
              products.map((list, index) => (
                <tr
                  className="border-b border-b-black cursor-pointer hover:bg-slate-100"
                  key={"prd-" + index + list.productName}
                  onClick={() => {
                    setIndex(Number(list.id));
                    modalHandler(list, 1);
                  }}
                >
                  <td className="border-l">{list.productName}</td>
                  <td className="border-l">{list.numbersByDay.mon}</td>
                  <td className="border-l">{list.numbersByDay.tue}</td>
                  <td className="border-l">{list.numbersByDay.wen}</td>
                  <td className="border-l">{list.numbersByDay.thr}</td>
                  <td className="border-l">{list.numbersByDay.fri}</td>
                  <td className="border-l">{list.numbersByDay.sat}</td>
                </tr>
              ))}
            <tr></tr>
          </tbody>
        </table>
      </div>
      <Dialog open={modal} onClose={handleClose}>
        <div className="w-[280px] p-4 space-y-3">
          <div className="flex flex-col gap-2">
            <p className="font-bold">제품명</p>
            <input
              className=" text-lg border p-1"
              type="text"
              name="prd_name"
              defaultValue={`${modalData?.productName}`}
            />
          </div>
          <div className="flex flex-row">
            <span className="px-4 bg-red-200">월</span>
            <input
              className="flex-1 text-center"
              type="number"
              name="mon_number"
              defaultValue={`${modalData?.numbersByDay.mon}`}
            />
          </div>
          <div className="flex flex-row">
            <span className="px-4 bg-orange-200">화</span>
            <input
              className="flex-1 text-center"
              name="tue_number"
              type="number"
              defaultValue={`${modalData?.numbersByDay.tue}`}
            />
          </div>
          <div className="flex flex-row">
            <span className="px-4 bg-green-300">수</span>
            <input
              className="flex-1 text-center"
              name="wen_number"
              type="number"
              defaultValue={`${modalData?.numbersByDay.wen}`}
            />
          </div>
          <div className="flex flex-row">
            <span className="px-4 bg-cyan-500">목</span>
            <input
              className="flex-1 text-center"
              name="thr_number"
              type="number"
              defaultValue={`${modalData?.numbersByDay.thr}`}
            />
          </div>
          <div className="flex flex-row">
            <span className="px-4 bg-blue-300">금</span>
            <input
              className="flex-1 text-center"
              name="fri_number"
              type="number"
              defaultValue={`${modalData?.numbersByDay.fri}`}
            />
          </div>
          <div className="flex flex-row">
            <span className="px-4 bg-purple-300">토</span>
            <input
              className="flex-1 text-center"
              name="sat_number"
              type="number"
              defaultValue={`${modalData?.numbersByDay.sat}`}
            />
          </div>
        </div>
        <div className="py-4 flex justify-center gap-4">
          <button
            onClick={() => {
              updateProducts();
            }}
            className={`${modalType ? "block" : "hidden"} px-4 py-2 rounded-md bg-orange-200`}
          >
            변경하기
          </button>
          <button
            onClick={() => {
              if (window.confirm("정말 삭제할까요?")) {
                deleteProducts();
              }
            }}
            className={`${modalType ? "block" : "hidden"} px-4 py-2 rounded-md bg-red-200`}
          >
            삭제하기
          </button>
          <button
            onClick={() => {
              createProduct();
            }}
            className={`${modalType ? "hidden" : "block"} px-4 py-2 rounded-md bg-blue-200`}
          >
            추가하기
          </button>
        </div>
      </Dialog>
    </div>
  );
}

export default App;
