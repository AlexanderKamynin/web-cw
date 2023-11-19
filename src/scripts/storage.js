import { MAX_RECORDS_SIZE } from "./const";

export class GameStorage
{
    constructor()
    {
        this.storage = localStorage;
    }

    setScore(score)
    {
        if(!this.storage.getItem("records_table"))
        {
            localStorage.setItem("records_table", JSON.stringify([]));
        }
        const userName = localStorage.getItem("name");
        let recordsTable = JSON.parse(this.storage.getItem("records_table"));

        const userResult = recordsTable.find(({ name }) => name === userName ) || {name: userName };

        recordsTable = recordsTable.filter(({name}) => name !== userName);
        const userScore = Math.max(userResult?.score || 0, score);

        recordsTable.push({
            name: userName,
            score: userScore
        });
        recordsTable.sort((a,b) => {
            return b.score - a.score;
        });

        while(recordsTable.length > MAX_RECORDS_SIZE)
        {
            recordsTable.pop();
        }

        this.storage.setItem("records_table", JSON.stringify(recordsTable));
    }
}