"use client";
import React, { useState } from "react";
import Link from "next/link";
import cardData from "../../../json/card.json";
import { useRouter } from "next/navigation";

interface Card {
  id: string | number;
  bankName: string;
  cardNumber: string;
  holderName: string;
  expiry: string;
  image?: string;
}

const PaymentMethod = () => {
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([...cardData.cards]);

  const [selectedCard, setSelectedCard] = useState<string | number | null>(1);

  const handleDeleteCard = (id: any) => {
    // 1. Pehle list update karo
    const updatedCards = cards.filter((card) => card.id !== id);
    setCards(updatedCards);
    if (selectedCard === id) {
      if (updatedCards.length > 0) {
        setSelectedCard(updatedCards[0].id);
      } else {
        setSelectedCard(null);
      }
    }
  };

  const cardCSS = {
    wrapper: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
      gap: "25px",
      padding: "20px 0",
    },
    // Dynamic function for selection styling
    cardBody: (isSelected: boolean) => ({
      background: "linear-gradient(135deg, #2b2b2b 0%, #111111 100%)",
      height: "200px",
      borderRadius: "16px",
      padding: "20px",
      position: "relative",
      color: "#fff",
      cursor: "pointer",
      boxShadow: isSelected
        ? "0 0 0 3px #8B0000, 0 10px 25px rgba(0,0,0,0.5)"
        : "0 10px 20px rgba(0,0,0,0.3)",
      transition: "all 0.3s ease",
      overflow: "hidden",
      fontFamily: "Arial, sans-serif",
    }),
    shine: {
      position: "absolute",
      top: "-50%",
      left: "-20%",
      width: "100%",
      height: "200%",
      background: "rgba(255, 255, 255, 0.04)",
      transform: "rotate(25deg)",
      pointerEvents: "none",
    },
    chip: {
      width: "40px",
      filter: "brightness(1.2)",
      marginBottom: "15px",
    },
    number: {
      fontSize: "20px",
      letterSpacing: "3px",
      fontFamily: '"Courier New", Courier, monospace',
      margin: "10px 0",
    },
  };

  return (
    // <div class="seva-serv-container">
    // <main>
    <div className="container home-wraper my-profile">
      <section>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="browse-wrp">
                <div className="browse-ctg-head my-con-head">
                  <h2 className="sub-cate-page">
                    {" "}
                    <button
                      onClick={() => router.back()}
                      className="btn p-0 m-0"
                    >
                      <img src="images/home/left-arrow.svg" alt="" />
                    </button>
                    Payment Method
                  </h2>
                  <div className="add-card">
                    <Link href="/add-new-card" className="primary-cta">
                      <img src="images/inner-page/add-rounded.svg" alt="" />
                      Add New Card
                    </Link>
                  </div>
                </div>
                <div className="card-wrp-surname">
                  <div className="card-wrp">
                    {/* <div className="single-card">
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="flexRadioDefault" id="radio1" defaultChecked />
                    </div>
                    <button type="button"><img className="cross-card" src="images/inner-page/card-cross.svg" alt="" /></button>
                    <img className="card" src="images/inner-page/payment-method-cart.svg" alt="" />
                  </div>
                  <div className="single-card">
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="flexRadioDefault" id="radio2" />
                    </div>
                    <button type="button"><img className="cross-card" src="images/inner-page/card-cross.svg" alt="" /></button>
                    <img className="card" src="images/inner-page/payment-method-cart.svg" alt="" />
                  </div>
                  <div className="single-card">
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="flexRadioDefault" id="radio3" />
                    </div>
                    <button type="button"><img className="cross-card" src="images/inner-page/card-cross.svg" alt="" /></button>
                    <img className="card" src="images/inner-page/payment-method-cart.svg" alt="" />
                  </div>
                  <div className="single-card">
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="flexRadioDefault" id="radio4" />
                    </div>
                    <button type="button"><img className="cross-card" src="images/inner-page/card-cross.svg" alt="" /></button>
                    <img className="card" src="images/inner-page/payment-method-cart.svg" alt="" />
                  </div> */}

                    {/* 
                    {cards.map((card) => (
                      <div className={`single-card ${selectedCard === card.id ? 'active-card' : ''}`} key={card.id}>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id={card.id}
                            checked={selectedCard === card.id}
                            onChange={() => setSelectedCard(card.id)}
                          />
                        </div>

                        
                        <button type="button" onClick={() => handleDeleteCard(card.id)}>
                          <img className="cross-card" src="images/inner-page/card-cross.svg" alt="Remove" />
                        </button>

                        <img className="card" src={card.image} alt="Card Image" />

                       
                        <p style={{ fontSize: '12px', marginTop: '10px', textAlign: 'center' }}>
                          {card.cardNumber}
                        </p>
                      </div>
                    ))} */}

                    {cards.map((card, index) => (
                      <div
                        key={card.id || index}
                        style={
                          cardCSS.cardBody(
                            selectedCard === card.id
                          ) as React.CSSProperties
                        }
                        onClick={() => setSelectedCard(card.id)}
                      >
                        <div style={cardCSS.shine as React.CSSProperties}></div>

                        {/* Top Section */}
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              checked={selectedCard === card.id}
                              onChange={() => setSelectedCard(card.id)}
                              style={{
                                accentColor: "#8B0000",
                                cursor: "pointer",
                              }}
                            />
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Yeh zaroori hai! Taaki card select na ho jaye delete karte waqt
                              handleDeleteCard(card.id);
                            }}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              zIndex: 2,
                            }}
                          >
                            <img
                              src="images/inner-page/card-cross.svg"
                              alt="Delete"
                            />
                          </button>
                        </div>

                        {/* Card Content */}
                        <div style={{ zIndex: 1, position: "relative" }}>
                          <div className="d-flex justify-content-between align-items-center">
                            <span style={{ fontSize: "12px", opacity: 0.7 }}>
                              Credit Card
                            </span>
                            <span
                              style={{ fontSize: "14px", fontWeight: "bold" }}
                            >
                              {card.bankName}
                            </span>
                          </div>

                          <img
                            src="https://cdn-icons-png.flaticon.com/512/6404/6404078.png"
                            alt="chip"
                            style={cardCSS.chip}
                          />

                          <div style={cardCSS.number}>{card.cardNumber}</div>

                          <div className="d-flex justify-content-between align-items-end mt-2">
                            <div
                              style={{
                                fontSize: "14px",
                                textTransform: "uppercase",
                              }}
                            >
                              {card.holderName}
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <span style={{ fontSize: "6px", lineHeight: 1 }}>
                                VALID
                                <br />
                                THRU
                              </span>
                              <span style={{ fontSize: "14px" }}>
                                {card.expiry}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {cards.length === 0 && (
                      <div className="text-center w-100 p-5">
                        <p>No cards saved. Please add a new card.</p>
                      </div>
                    )}
                  </div>
                  {/* <div className="card-help">
                    <button type="button" className="secondary-cta">Help & Support</button>
                    <button type="button" className="primary-cta">Pay Now <span>$70</span></button>
                  </div> */}

                  <div className="card-help">
                    <button
                      type="button"
                      className="secondary-cta"
                      onClick={() => router.push("/help-support")}
                    >
                      Help & Support
                    </button>
                    <button
                      type="button"
                      className="primary-cta"
                      disabled={cards.length === 0}
                      onClick={() =>
                        alert(`Paying using card: ${selectedCard}`)
                      }
                    >
                      Pay Now <span>$70</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    // </main>
    // </div>
  );
};

export default PaymentMethod;
