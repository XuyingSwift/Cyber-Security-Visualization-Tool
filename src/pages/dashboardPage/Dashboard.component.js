import React from 'react';
import { DashboardGrid, CardGroupWrapper, GroupWrapper, Group } from './Dashboard.styles';
import MainHeader from '../../components/mainHeader/MainHeader.component';
import * as CalendarChartProps from '../../charts/CalendarChartProps';
import * as LineChartProps from '../../charts/LineChartProps';
import * as TableChartProps from '../../charts/TableChartProps';
import RiskCard from '../../components/riskCard/RiskCard.component';
import PiqueChart from '../../charts/PiqueChart.component';
import { createStructuredSelector } from 'reselect';
import { selectProjects, selectQuarters, selectRiskList } from '../../redux/piqueTree/PiqueTree.selector';
import { connect } from 'react-redux';
import ArrowButton from '../../components/arrowButton/ArrowButton.component';
import {IoSkullOutline} from 'react-icons/io5'
import {ImWarning} from 'react-icons/im';
import {RiAlarmWarningLine} from 'react-icons/ri'
import {RiSecurePaymentLine} from 'react-icons/ri'
import {CgDanger} from 'react-icons/cg';


const Dashboard = ({projects, riskList, quarters}) => {
    const riskLevelOptions = [   
        {
            label: 'Severe',
            value: '#cb0032',
            icon: <IoSkullOutline/>
        },
        {
            label: 'High',
            value: '#ff6500',
            icon: <RiAlarmWarningLine/>
        },
        {
            label: 'Elevated',
            value: '#fde101',
            icon: <CgDanger/>
        },
        {
            label: 'Guarded',
            value: '#3566cd',
            icon: <ImWarning/>
        },
        {
            label: 'Low',
            value: '#009a66',
            icon: <RiSecurePaymentLine/>
        }  
]

    // get the bin data from uploajded files
    const getBinData = () => {
        let binData = [];
        binData.push(["version", "score"]);
        projects.map((file, index) => binData.push([`v${file.versionNumber}`, file.fileContent.value]));
        return binData;
    }

    
    const card = riskList.map((file, index) => {
        return (<RiskCard title={file.qaName} score={file.qaValue} color={file.qaColor} icon={file.qaIcon} key={index}/>)
    })

    const riskCard = riskLevelOptions.map((item, index) => {
        return (<RiskCard title={item.label} color={item.value} icon={item.icon}/>)
    })

    console.log("dashboard", projects)

    const getTitle = () => {
        let lineChartTitle = '';
        projects.map((file, index) => lineChartTitle = file.fileContent.name)
        return lineChartTitle;
    }
    const getTableChartOptions = () => {
        let options = {
            title: getTitle(),
            curveType: "function",
            legend: { position: "bottom" },
            allowHtml: true,
            width: '100%', 
            height: '90%',
        }
        return options;
    }

     const data = [
        ["Score", "Q1 2021", "Q2 2021", "Q3 2021", "Q2 2021"],
        ["TQI", { v:0.5}, { v:0.6}, { v:0.7}, { v:0.8}],
        ["Performance", { v:0.4}, { v:0.5}, { v:0.6}, { v:0.7}],
        ["Compatibility", { v:0.5}, { v:0.6}, { v:0.7}, { v:0.8}],
        ["Maintainability", { v:0.6}, { v:0.7}, { v:0.8}, { v:0.9}],
        ["Seucrity", { v:0.5}, { v:0.6}, { v:0.7}, { v:0.8}],
      ];

      const getTableChartData = () => {
        let data = []
        if (projects != null) {
            let files = projects.filter(file => file["QuarterNumber"] != null);
            let scores =[]
            scores.push("Score");
            quarters.map(q => scores.push(q));
            let tqi = []
            tqi.push("TQI");
            files.map(f => tqi.push({v:f.fileContent["value"]}));
            let size = 0;
            files.map(f => size = f.fileContent.children.length);
            data.push(scores);
            data.push(tqi)
            let names = []
            let kids =[]
            files.map(file => kids.push(file.fileContent.children) )
            for (let i =0; i<size; i++) {
                names.push(kids[0][i].name);
            }
            for (let i= 0; i<size; i++ ) {
                let arr = [];
                arr.push(names[i]);
                files.map(f => arr.push({v: parseFloat(f.fileContent.children[i].value).toFixed(3)}))
                data.push(arr)
            }
        }
         
          return data;
      }

      console.log(getTableChartData())
    return (
        <DashboardGrid>
            <MainHeader
                width={CalendarChartProps.width}
                height={CalendarChartProps.height}
                data={CalendarChartProps.inputData}
                chartType={CalendarChartProps.chartType}
                options={CalendarChartProps.options}
                showButton={CalendarChartProps.showButton}
            />
            <div>
                <CardGroupWrapper>{riskCard}</CardGroupWrapper>
            </div>
            <div>
                {projects? (<div>
                    <ArrowButton>show projects</ArrowButton>
                    <CardGroupWrapper>
                        {card}
                    </CardGroupWrapper>
                    </div>) : null}
            
            </div>

            <GroupWrapper>
                <Group>
                    <PiqueChart 
                        width={LineChartProps.width}
                        height={LineChartProps.height}
                        data={getBinData()}
                        options={LineChartProps.options}
                        chartType={LineChartProps.chartType}
                        showButton={LineChartProps.showButton}
                    />
                </Group>
                <Group>
                    <PiqueChart
                        width={TableChartProps.width}
                        height={TableChartProps.height}
                        data={getTableChartData()}
                        options={getTableChartOptions()}
                        chartType={TableChartProps.chartType}
                        showButton={TableChartProps.showButton}
                    />
                </Group>
            </GroupWrapper>
        </DashboardGrid>
    )
}

const mapStateToProps = createStructuredSelector({
    projects: selectProjects,
    riskList: selectRiskList,
    quarters: selectQuarters
})

export default connect(mapStateToProps)(Dashboard)