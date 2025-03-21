import { modalListSelector, ModalIdType } from "@/stores/modalStore";
import { createPortal } from "react-dom";
import style from "./Modal.module.scss";
import { ReactNode, useEffect, useRef } from "react";
import useModal from "@/hooks/useModal";
import { useRecoilValue } from "recoil";

interface Props {
  id: ModalIdType;
  children: ReactNode;
  position: "center" | "bottom";
  bottomModalHeight?: string;
}

function ModalContainer({
  id, //외부클릭 시 해당 모달을 닫기 위해 id를 사용중
  position,
  bottomModalHeight,
  children,
}: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { closeModal } = useModal(id);
  const activeModal = useRecoilValue(modalListSelector(id));

  const handleModal = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      closeModal();
    }
  };
  useEffect(() => {
    if (activeModal.id === id) {
      document.addEventListener("mousedown", handleModal);
    }

    return () => {
      document.removeEventListener("mousedown", handleModal);
    };
  });
  const renderModal = () => {
    return (
      <div>
        {/* ============================= 모달 위치 - bottom [START] ============================= */}
        {position === "bottom" && (
          <div
            className={`${style["modal__overlay"]} ${style["modal--bottom"]}`}
          >
            <div
              className={`${style["modal__content-box"]} ${style["modal-content--full-width"]} ${style["modal--bottom"]}`}
              ref={modalRef}
              style={{ "--modal-height": bottomModalHeight }}
            >
              {children}
            </div>
          </div>
        )}
        {/* ============================= 모달 위치 - bottom [END] ============================= */}

        {/* ============================= 모달 위치 - center [START] ============================= */}
        {position === "center" && (
          <div className={style["modal__overlay"]}>
            <div
              className={`${style["modal__content-box"]} ${style["modal--center"]}`}
              ref={modalRef}
            >
              {children}
            </div>
          </div>
        )}
        {/* ============================= 모달 위치 - center [END] ============================= */}
      </div>
    );
  };

  if (typeof document !== "undefined") {
    return createPortal(
      <>{renderModal()}</>,
      document.getElementById("modal") as HTMLElement
    );
  }
}

export default ModalContainer;
