import React, {useState} from 'react';

const TermOfService = () => {
    const [showTerms, setShowTerms] = useState(false);
    return (
        <>
            <button className="button" onClick={() => setShowTerms(true)}>서비스 이용 약관</button>
            <div className={"modal has-text-left " + (showTerms ? " is-active" : "")}>
                <div className="modal-background has-opacity-0-5" onClick={() => setShowTerms(false)}></div>
                <div className="modal-card has-width-60vw-tablet">
                    <header className="modal-card-head has-bg-danger">
                        <p className="modal-card-title">사이트 이용 약관</p>
                        <button className="delete" aria-label="close" onClick={() => setShowTerms(false)}></button>
                    </header>
                    <section className="modal-card-body">
                        <p className="has-padding-bottom-15 fa-0-9x">
                            안녕하세요.
                            <br/>무브(Moobe) 서비스를 이용해 주셔서 감사합니다.
                            <br/>무브는 Map Of Youtube의 약어이자 Move(움직이다)와의 비슷한 발음을 통해 ‘유튜버들이 다녀온 곳으로 이동하다.’라는 중의적 의미를 내포하고 있습니다.
                            유튜버들이 다녀온 멋진 장소들을 무브(Moobe)를 이용해 쉽고 편리하게 찾아가 보세요.
                            <br/>무브(Moobe)는 사용자 및 유튜버 분들의 의견을 소중하게 생각합니다.
                            <br/>언제든지 궁금하신 사항 및 수정 및 보완이 되어야 하는 부분이 있다면 아래 기입된 메일로 연락 주세요. 확인 후 조치를 취할 수 있도록 하겠습니다. (beom.gary@gmail.com)
                        </p>
                        <p className="title fa-0-9x">제 1조 (목적)</p>
                        <div className="subtitle fa-0-87x has-padding-bottom-15">
                            본 약관은 Moobe(무브) 사이트(이하 "Moobe")가 제공하는 모든 서비스(이하 "서비스")의 이용조건 및 절차, 이용자와 Moobe의 권리, 의무, 책임사항과 기타 필요한 사항을 규정함을 목적으로 합니다.<br/>
                            Moobe는 유튜버들이 방문했던 장소들을 지도 서비스로 제공함으로써 사용자들이 쉽고 편리하게 장소에 찾아갈 수 있는 방법을 제공하는데 목적이 있습니다.
                        </div>
                        <p className="title fa-0-9x">제 2조(서비스의 운영방침)</p>
                        <div className="subtitle fa-0-87x has-padding-bottom-15">
                            <ol className="has-padding-top-5 has-padding-left-25 has-list-style-decimal">
                                <li>
                                    <p className="fa-0-9x">Youtube 컨텐츠의 사용</p>
                                    <div className="fa-0-87x">
                                        <ol className="has-padding-left-15 has-list-style-disc">
                                            <li>Moobe는 Moobe 내에서 사용되는 모든 유튜브 컨텐츠에 대한 썸네일 및 영상에 대해 어떠한 데이터의 변형도 가하지 않으며 유튜브에서 공식적으로 제공하고 있는 링크 및 API를 기반으로 컨텐츠를 제공합니다.</li>
                                            <li>재생되는 모든 컨텐츠는 유튜브에서 공식적으로 제공하는 Embeddable Player 형태로 실제로 유튜브 내에서 재생되는 것과 동일하며, 원 저작자에게 어떠한 경제적 피해(원저작자의 광고수입)도 주지 않습니다.</li>
                                            <li>컨텐츠의 어떠한 썸네일 이미지와 영상도 Moobe 자체적인 서버에 저장하고 있지 않습니다.</li>
                                            <li>Moobe 내에서 제공되는 유튜브의 컨텐츠 중 컨텐츠의 원작자가 퍼가기 허용을 하지 않은 컨텐츠에 대해서는 무브에서 재생이 불가능 하며, 단순 썸네일 링크로 대체 될 수 있음을 알립니다.</li>
                                        </ol>
                                    </div>
                                </li>
                                <li>
                                    <p className="fa-0-9x has-padding-top-15">회원가입 및 Moobe 커뮤니티 이용</p>
                                    <div className="fa-0-87x">
                                        <ol className="has-padding-left-15 has-list-style-disc">
                                            <li>Moobe는 소셜 로그인(Google)을 통한 로그인 기능을 지원합니다.</li>
                                            <li>Moobe는 로그인한 사용자의 이메일을 제외한 어떠한 개인 정보도 수집 및 저장하지 않습니다.</li>
                                            <li>Moobe에 로그인한 사용자는 원하는 정보들을 모아보거나 Moobe 내에서 컨텐츠에 댓글을 자유롭게 등록할 수 있습니다.</li>
                                            <li>Moobe의 로그인한 사용자 중 사용자에게 거짓 정보를 제공하거나 악의적인 목적이라고 판단되는 댓글은 사전 통보 없이 삭제될 수 있음을 알립니다.</li>
                                        </ol>
                                    </div>
                                </li>
                                <li>
                                    <p className="fa-0-9x has-padding-top-15">서비스 운영</p>
                                    <div className="fa-0-87x">
                                        <ol className="has-padding-left-15 has-list-style-disc">
                                            <li>Moobe는 서비스에 필요한 장비의 유지 보수를 위해 정기 또는 임시 점검 및 다른 외부적 요인으로 서비스의 제공이 일시 중단될 수 있습니다.</li>
                                        </ol>
                                    </div>
                                </li>
                            </ol>
                        </div>
                    </section>
                    <footer className="modal-card-foot justify-flex-end">
                        <button className="button" onClick={() => setShowTerms(false)}>닫기</button>
                    </footer>
                </div>
            </div>
        </>
    )
}

export default TermOfService;