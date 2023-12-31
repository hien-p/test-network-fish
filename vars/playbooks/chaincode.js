'use strict';


const { Contract } = require('fabric-contract-api');


class FishChaincode extends Contract {


// FishidExists: Check key
async FishExists(ctx, fish_id) {
    let assetState = await ctx.stub.getState(fish_id);
    return assetState && assetState.length > 0;
}


//InitLedger
async InitLedger(ctx) {
    // const assets = [
    //     { id: "133", citizen_id: "123", supplier_id: "123",
    //    dealer_id: "123", status: "UNUSE", value: "123", package_id: "123",
    //    created_at: new Date().toString(), updated_at: new Date().toString()}
    // ];


    const assets = [
        { Vessel: "923F", Location: "67.0006, -70.5476", Timestamp: "1504054225", dealer_id: "123", Holder: "Miriam" },
        { Vessel: "M83T", Location: "91.2395, -49.4594", Timestamp: "1504057825", dealer_id: "123", Holder: "Dave" },
        { Vessel: "T012", Location: "58.0148, 59.01391", Timestamp: "1493517025", dealer_id: "312", Holder: "Igor" },
        { Vessel: "P490", Location: "-45.0945, 0.7949", Timestamp: "1496105425", dealer_id: "1412", Holder: "Amalea" },
        { Vessel: "S439", Location: "-107.6043, 19.5003", Timestamp: "1493512301", dealer_id: "241", Holder: "Rafa" }
    ]


    for (const asset of assets) {
        await this.createRecord(
            ctx,
            asset.Vessel,
            asset.Location,
            asset.Timestamp,
            asset.dealer_id,
            asset.name_holder,
        );
    }
}


//RecordFish
/*
Fisherman  would use to record each of  fish catches.
This method takes in five arguments (attributes to be saved in the ledger).
*/
async createRecord(ctx, key, Location, Timestamp, holder_id, name_holder) {
    const exists = await this.FishExists(ctx, key);
    if (exists) {
        throw new Error('The id already exists');
    }


    let Fish_records = {
        docType: 'Fish',
        key: key,
        Location: Location,
        Timestamp: Timestamp,
        holder_id: holder_id,
        name_holder: name_holder
    }
    //Save Fish catches to state database
    await ctx.stub.putState(key, Buffer.from(JSON.stringify(Fish_records)));




    //Create and save voucherCitizenIndexKey
    let indexName = 'key~holder_id';
    let voucherCitizenIndexKey = await ctx.stub.createCompositeKey(indexName, [Fish_records.key, Fish_records.holder_id]);
    await ctx.stub.putState(voucherCitizenIndexKey, Buffer.from('\u0000')); //add index to database
}


// deleteAllFish: Deletes all fish records from the ledger
async deleteAllFish(ctx) {
    const fishIterator = await ctx.stub.getStateByRange('', '');
    let res = await fishIterator.next();


    while (!res.done) {
        if (res.value && res.value.key) {
            console.log(`Deleting record ${res.value.key}`);
            await ctx.stub.deleteState(res.value.key);
        }
        res = await fishIterator.next();
    }


    await fishIterator.close();
    console.log('All fish records have been deleted');
}


// queryFish
async queryFish(ctx, vesselName) {
    const fishRecordBytes = await ctx.stub.getState(vesselName);
    if (!fishRecordBytes || fishRecordBytes.length === 0) {
        throw new Error(`Fish record does not exist for vessel ${vesselName}`);
    }
    const fishRecord = JSON.parse(fishRecordBytes.toString());
    return fishRecord;
}


// queryAllFish
async queryAllFish(ctx) {
    const allResults = [];
    const iterator = await ctx.stub.getStateByRange('', '');
    let result = await iterator.next();
    while (!result.done) {
        const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
        let record;
        try {
            record = JSON.parse(strValue);
            allResults.push({ Key: result.value.key, Record: record });
        } catch (err) {
            console.log(err);
            record = strValue;
        }
        result = await iterator.next();
    }
    await iterator.close();


    return JSON.stringify(allResults);
}




// changeFishHolder
/*
The data in the world state can be updated with who has possession.
This function takes in 2 arguments, fish_id and new holder name.
*/
// changeFishHolder: Update the holder of a fish record
async changeFishHolder(ctx, fish_id, newHolderName) {
    const fishRecordBytes = await ctx.stub.getState(fish_id);
    if (!fishRecordBytes || fishRecordBytes.length === 0) {
        throw new Error(`Fish with ID ${fish_id} does not exist`);
    }
    const fishRecord = JSON.parse(fishRecordBytes.toString());


    fishRecord.name_holder = newHolderName;


    await ctx.stub.putState(fish_id, Buffer.from(JSON.stringify(fishRecord)));


    console.log(`Holder of fish ID ${fish_id} changed to ${newHolderName}`);
}

}
module.exports = FishChaincode;