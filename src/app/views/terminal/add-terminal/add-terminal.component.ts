import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import { ActivatedRoute, Router } from '@angular/router';
import { PorteurService } from 'app/services/porteur.service';
import { ClientService } from 'app/services/client.service';
import { TerminalService } from 'app/services/terminal.service';
import { AffilService } from 'app/services/affil.service';
import { PointService } from 'app/services/point.service';
import { TpeService } from 'app/services/tpe.service';
import { AffilieService } from 'app/services/affilie.service';
import { StationsService } from 'app/services/stations.service';
import { Console, log } from 'console';

@Component({
  selector: 'app-add-terminal',
  templateUrl: './add-terminal.component.html',
  styleUrls: ['./add-terminal.component.scss']
})
export class AddTerminalComponent implements OnInit {
  form: FormGroup;
  submitted: boolean;
  isLoading: boolean = false;
  oldTerminal: any ; 
  affils: any = [];
  points: any = [];
  tpes: any = [];
  tpesAllAvailables: any = [];

  constructor(private route: ActivatedRoute,

    private fb: FormBuilder,
    private toasterService: ToasterService,
    private router: Router,
    private stationsService:StationsService,
    private terminalService:TerminalService ,
    private tpeService:TpeService
  ) { }

  clients: any = [];
  FiltredStation: any = [];
  stations: any = [];
  filtredStation: any;
  editMode = false;
  model = {
    idTerminal: '', // Ensure this matches the property names used in your form controls
    idAffilie: '',
    idStation: '',
    serialNumber: '',
    idBancaire: '',
    etatTerminal: '',
    dateCreation: '',
    confVersion: '',
    binaryVersion: '',
    withBalance: '',
    batchNumber: '',
    sequenceNumber: '',
    datePremiereOp: '',
    designation: '',
    codeResponsable: '',
    statutReservation: '',
    telephone: '',
    dateStatutReservation: ''
  };
  
  ngOnInit() {
    if (this.route.snapshot.paramMap.get('id')) {
      this.editMode = true;
      this.getTerminalById(this.route.snapshot.paramMap.get('id'));
    } else {
      this.editMode = false;
      this.initializeForm();
    }

    this.getStation();
 }

 initializeForm() {
    this.form = this.fb.group({
      IdTerminal: new FormControl("", [Validators.required, Validators.maxLength(12)]),
      IdAffilie: new FormControl(""),
      IdStation: new FormControl("", Validators.required),
      SerialNumber: new FormControl("", Validators.required),
      IdBancaire: new FormControl(""),
      EtatTerminal: new FormControl(""),
      DateCreation: new FormControl(""),
      ConfVersion: new FormControl(""),
      BinaryVersion: new FormControl(""),
      WithBalance: new FormControl(""),
      BatchNumber: new FormControl(""),
      SequenceNumber: new FormControl(""),
      DatePremiereOp: new FormControl(""),
      Designation: new FormControl("", [Validators.required, Validators.maxLength(16)]),
      CodeResponsable: new FormControl(""),
      StatutReservation: new FormControl(""),
      telephone: new FormControl(""),
      DateStatutReservation: new FormControl("")
    });

    if (this.editMode) {
      this.form.get('IdTerminal').disable();
      this.form.get('telephone').disable();
    }
 }

 getTerminalById(id) {
    this.terminalService.get(id).subscribe((resp: any) => {
      this.createform(resp);
    }, (err) => {
      // Handle error
    });
 }

 getStation() {
    this.stationsService.List().subscribe((resp: any) => {
      this.stations = resp;
    }, (err) => {
      // Handle error
    });
 }

 createform(model) {
    this.geTpeDisponibleByStation(model.idStation);
    this.form.controls['IdTerminal'].setValue(model.idTerminal);
    this.form.controls['IdAffilie'].setValue(model.idAffilie);
    this.form.controls['IdStation'].setValue(model.idStation);
    this.form.controls['SerialNumber'].setValue(model.serialNumber);
    this.form.controls['IdBancaire'].setValue(model.idBancaire);
    this.form.controls['EtatTerminal'].setValue(model.etatTerminal);
    this.form.controls['DateCreation'].setValue(model.dateCreation);
    this.form.controls['ConfVersion'].setValue(model.confVersion);
    this.form.controls['BinaryVersion'].setValue(model.binaryVersion);
    this.form.controls['WithBalance'].setValue(model.withBalance);
    this.form.controls['BatchNumber'].setValue(model.batchNumber);
    this.form.controls['SequenceNumber'].setValue(model.sequenceNumber);
    this.form.controls['DatePremiereOp'].setValue(model.datePremiereOp);
    this.form.controls['Designation'].setValue(model.designation);
    this.form.controls['CodeResponsable'].setValue(model.codeResponsable);
    this.form.controls['StatutReservation'].setValue(model.statutReservation);
    this.form.controls['telephone'].setValue(model.telephone); // Corrected from model.statutReservation to model.telephone
    this.form.controls['DateStatutReservation'].setValue(model.dateStatutReservation);
 }

 geTpeDisponibleByStation(event: any) {
    this.form.controls['SerialNumber'].setValue("");
    this.tpeService.geTpeDisponibleByStation(event).subscribe((resp: any) => {
      this.tpes = resp;
    }, (err) => {
      // Handle error
    });
 }

 get f() { return this.form.controls; }
}