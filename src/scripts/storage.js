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

        let recordsTable = JSON.parse(this.storage.getItem("records_table"));
        recordsTable.push({
            name: this.storage.getItem("name"),
            score: score
        });
        recordsTable.sort((a,b) => {
            if(a.score > b.score)
            {
                return -1;
            }
            if(a.score < b.score)
            {
                return 1;
            }

            return 0;
        });

        while(recordsTable.length > MAX_RECORDS_SIZE)
        {
            recordsTable.pop();
        }

        this.storage.setItem("records_table", JSON.stringify(recordsTable));
    }
}