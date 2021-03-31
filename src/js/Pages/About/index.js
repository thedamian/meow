import {h, render, Component} from 'preact';
import {BubbleSlide, BubbleCollection, Bubble} from '../../Components';
import {Cat} from '../../Services';
import Poes from '../../../img/poes.jpg';
import Styles from './about.scss';

export default class AboutPage extends Component {
    componentWillMount() {
        // Hacky, yeah I know!
        window.setTimeout(() => {
            Cat.me();
        });
    }

    render() {
        return (
            <BubbleSlide previous="/" next="/speech">
                <Bubble>My name is Damian Montero.</Bubble>
                <Bubble>Go to Meow.FloridaJS.com to follow along.</Bubble>
                <Bubble>I'm a software engineer at <span className={Styles.mwl}>Vertical Bridge</span>.</Bubble>
                <Bubble>I'm a Organizer of the <span className={Styles.fronteers}>Boca JS</span> meetups.</Bubble>
                <Bubble>You can find me online as <a href="https://github.com/thedamian" target="_blank">Damian Montero</a>.</Bubble>
                <Bubble>This is a copy of a presentation created by Sam Bellen. And he LOVES cats! 😻</Bubble>
                <Bubble><img src={Poes} alt="My cat, Poes." className={Styles.poes}/></Bubble>
            </BubbleSlide>
        );
    }
};
