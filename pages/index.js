
import Image from 'next/image'
import styles from "../styles/Home.module.scss"
import Navbar from "/components/navbar.js";
import Theme from "/components/theme.js";

export default function Home() {
    // Only some front end, there is no backend here at all
    return (
        <section className={styles.Home}>
            <div className={styles.header}>
                <Navbar></Navbar>
                <Theme />

                <section className={styles.welcome}>
                    <div className={styles.welcometext}>
                        <p>
                            The most powerful web app for <i>planning, organizing and scheduling</i> your life.
                        </p>
                    </div>
                    <div className={styles.plantLeft}>
                        <Image
                            src="/images/plantLeft.png"
                            alt=""
                            fill
                            className={styles.ImagePlantLeft}
                        />
                    </div>
                    <div className={styles.tallPlantRight}>
                        <Image
                            src="/images/plantRight.png"
                            alt=""
                            fill
                            className={styles.ImagePlantRight}
                        />
                    </div>
                    <div className={styles.topRightLeaves}>
                        <Image
                            src="/images/topRightLeaves.png"
                            alt=""
                            fill
                            className={styles.ImageRightLeaves}
                        />
                    </div>
                </section>
            </div >
        </section >
    );

}