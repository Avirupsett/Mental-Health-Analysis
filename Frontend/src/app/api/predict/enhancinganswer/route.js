import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import connectDB from '../../../../lib/connectDB';
import { getUser } from '@workos-inc/authkit-nextjs';
import qaAssignment from '../../../../models/qaAssignment';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export async function POST(req) {
    try {
        
        await connectDB();
        const { user } = await getUser();
    
        //Find the question and Save the answer to the qaAssignment collection
        const existingQaAssignment = await qaAssignment.findOne()
            .where({ user_id: user.id, answer: { $size: 0 } })
            .sort({ created_at: -1 })
            .lean();
    
        let data = await req.json()
    

        const enhancedData = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are an expert answer completion assistant specializing in mental health responses. Your role is to:
    
                    1. Core Functions:
                    - Analyze question-answer alignment
                    - Maintain original context and meaning
    
                    2. Completion Process:
                    - Map question components
                    - Keep it short in one line and simple
    
                    3. Quality Standards:
                    - Answer completeness`
                },
                {
                    role: "user",
                    content: `Analyze and complete the following mental health Q&A:
    
                    Original Questions:  ${JSON.stringify(existingQaAssignment.question)}
    
                    Original Answers: ${JSON.stringify(data)}
    
                    Complete the answer by:
    
                    1. Question Analysis:
                    - Identify main question components
    
                    2. Answer Evaluation:
                    - Check completeness
                    - Verify relevance
    
                    3. Completion Requirements:
                    - Keep original meaning
                    - Use consistent language
    
    
                    Format response in json as:
                    {
                        "enhancedAnswer": [
                             {"1": "enhanced response for question 1"},
                            {"2": "enhanced response for question 2"},
                            // ... continue for all questions
                        ]
                    }
    
                    Ensure the enhanced answer:
                    1. Preserves original meaning
                    2. Keep it short in one line and simple.
                    3. Don't add extra text or assume anything which is not there in original answer
                    4. Use the vocabulary below in the enhanced answer wherever possible
                        [feel,not,like,get,want,know,life,time,think,can,make,even,would,people,year,day,really,thing,one,try,take,well,work,friend,say,help,bad,much,never,tell,good,see,could,live,start,need,back,anymore,anxiety,talk,still,way,anything,something,depression,love,always,end,anyone,everything,die,come,find,every,keep,hate,nothing,someone,month,long,also,family,give,since,last,job,leave,right,look,week,care,hard,stop,kill,lot,ever,fucking,everyone,happen,sleep,point,person,lose,use,thought,pain,tired,around,else,happy,seem,first,school,away,ask,shit,fuck,alone,wish,parent,ago,hurt,hope,maybe,enough,new,past,reason,experience,feeling,many,old,night,home,problem,mental,world,today,let,move,call,able,actually,health,break,put,sure,cry,suicide,little,though,change,without,sometimes,relationship,mom,ill,two,hour,become,head,mean,post,struggle,understand,kind,mind,deal,place,eat,almost,another,please,suicidal,already,depressed,wrong,issue,doctor,wake,sad,stay,read,pretty,might,self,close,probably,money,normal,therapy,high,guy,scared,heart,thank,brain,sorry,next,other,symptom,body,turn,part,matter,house,cause,finally,recently,guess,worry,spend,hear,yet,believe,bit,different,dad,bed,advice,therapist,fear,med,social,remember,write,whole,medication,sick,fall,least,real,death,great,suffer,bipolar,literally,stuff,plan,constantly,completely,attack,college,kid,big,idea,either,panic,miss,girl,due,diagnose,situation,soon,wait,pay,anxious,moment,realize,side,support,bring,mother,couple,meet,enjoy,future,fail,show,episode,may,decide,watch,play,etc,everyday,okay,stupid,honestly,sit,morning,low,man,wonder,fine,face,run,afraid,idk,cut,dream,hold,room,fight,that,lie,together,disorder,control,weird,hit,alive,question,walk,nobody,worth,hell,later,far,depress,drive,pass,going,deserve,child,fact,attempt,easy,have,small,study,exist,second,dead,date,less,state,often,car,suppose,suck,god,notice,single,drink,grow,word,young,full,open,learn,age,story,basically,begin,eye,sound,extremely,emotion,minute,usually,energy,nice,game,fun,instead,amp,barely,hang,lonely,brother,hospital,sense,food,hand,boyfriend,class,horrible,continue,listen,speak,waste,inside,share,currently,mood,girlfriend,however,send,abuse,reach,early,test,rest,you,type,push,deep,truly,check,buy,course,phone,act,drug,cope,scare,especially,father,lately,human,constant,half,anyway,ruin,woman,sister,angry,strong,manage,chest,blood,whatever,stick,online,possible,treat,forget,handle,force,consider,mentally,motivation,short,partner,terrible,relate,mess,group,absolutely,outside,tomorrow,entire,cancer,crazy,sort,psychiatrist,weight,physical,accept,fix,quite,throw,empty,bear,worried,explain,stand,trigger,focus,trust,effect,late,free,dog,pill,fast,rather,answer,expect,forward,quit,super,figure,thinking,illness,whenever,yes,three,lead,severe,country,yesterday,there,happiness,eventually,difficult,chance,burden,option,video,healthy,appreciate,follow,miserable,ready,emotional,failure,manic,behind,living,save,grade,harm,sex,seriously,amount,shitty,depressive,they,physically]
                    5. Replace the word "stress" with "depression" or "anxiety" based on context, choosing the most appropriate term.
                        `
                }
            ],
            model: "llama3-groq-70b-8192-tool-use-preview",
            temperature: 0,
            response_format: { type: "json_object" }
        });
    
        const enhancedAnswer = JSON.parse(enhancedData.choices[0]?.message?.content);

        if (!enhancedAnswer) {
            return NextResponse.json({ error: "Failed to enhance answer" }, { status: 500 });
        }


        return NextResponse.json( enhancedAnswer );

    } catch (error) {
        console.error("Error enhancing answer:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
