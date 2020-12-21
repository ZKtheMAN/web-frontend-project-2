import React from 'react';

export function AboutView() {
    return (
        <div className="AboutView">
            <header><h1>About</h1></header>
            <p><b>Authors:</b> Zakee Khattak, Chukwudi Ikem, Rene Ortiz</p>
            <p><b>Data from:</b></p>
            <ul>
                <li><a href="https://disease.sh">Worldometers via disease.sh</a></li>
                <li><a href="https://disease.sh">Johns Hopkins University via disease.sh</a></li>
                <li><a href="https://covidtracking.com/">The COVID Tracking Project at <i>The Atlantic</i></a></li>
            </ul>
        </div>
    )
}