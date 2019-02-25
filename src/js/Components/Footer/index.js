import {h, render, Component} from 'preact';
import styles from './footer.scss';
import Icon from '../Icon';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <span>Live . Boca JS . org - Github.com / The Damian</span>
            <a className={styles['footer__twitter']} href="https://twitter.com/DamianMontero" target="_blank">
                <Icon name="twitter" size="small" className={styles['footer__icon']}/>
                <span>@DamianMontero</span>
            </a>
        </footer>
    );
};

Footer.propTypes = {};

export default Footer;
