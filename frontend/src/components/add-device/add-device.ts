import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

interface DeviceMappingRow {
  id: string;
  parameter: string;
  registerAddress: string;
  registerType: string;
  dataType: string;
  interval: string;
}

interface Device {
  id: string | null;
  deviceName: string | null;
  devicePort: string | null;
  ipAddress: string | null;
  mode: string | null;
  samplingInterval: string | null;
  timeout: string | null;
  deviceMappings?: DeviceMappingRow[];
}

@Component({
  selector: 'app-add-device',
  imports: [ReactiveFormsModule, ToastModule, RouterModule],
  templateUrl: './add-device.html',
  styleUrl: './add-device.css',
  providers: [MessageService],
})
export class AddDevice {
  private messageService = inject(MessageService);
  private router = inject(Router);

  private deviceName: WritableSignal<string> = signal('Device Name');
  private devicePort: WritableSignal<string> = signal('Device Port');
  private deviceId: WritableSignal<string> = signal('Device Id');
  private samplingInterval: WritableSignal<string> =
    signal('Sampling Interval');
  private ipAddress: WritableSignal<string> = signal('Ip Address');
  private mode: WritableSignal<string> = signal('Mode');

  deviceForm = new FormGroup({
    id: new FormControl<string | null>(null),
    deviceName: new FormControl<string | null>(null),
    devicePort: new FormControl<string | null>(null),
    deviceProfile: new FormControl<string | null>(null),
    ipAddress: new FormControl<string | null>(null),
    mode: new FormControl<string | null>(null),
    samplingInterval: new FormControl<string | null>(null),
    timeout: new FormControl<string | null>(null),
  });

  handleFormData() {
    if (
      this.deviceForm.value.deviceName === null ||
      this.deviceForm.value.deviceName === ''
    ) {
      this.generateToast('Please Enter the Device Name', this.deviceName);
    }

    if (
      this.deviceForm.value.devicePort === null ||
      this.deviceForm.value.devicePort === ''
    ) {
      this.generateToast('Please Enter the Device Port', this.devicePort);
    }

    if (this.deviceForm.value.id === null || this.deviceForm.value.id === '') {
      this.generateToast('Please Enter the Device Id', this.deviceId);
    }

    if (
      this.deviceForm.value.ipAddress === null ||
      this.deviceForm.value.ipAddress === ''
    ) {
      this.generateToast('Please Enter the IP Address', this.ipAddress);
    }

    if (
      this.deviceForm.value.mode === null ||
      this.deviceForm.value.mode === ''
    ) {
      this.generateToast('Please Enter the Transmission Mode', this.mode);
    }

    if (
      this.deviceForm.value.samplingInterval === null ||
      this.deviceForm.value.samplingInterval === ''
    ) {
      this.generateToast(
        'Please Enter the Sampling Interval',
        this.samplingInterval
      );
    }

    console.log('device data', this.deviceForm.value);
    this.deviceForm.reset();
  }

  navigateToDeviceMapping() {
    // Get current device data
    const deviceData: Device = {
      id: this.deviceForm.value.id || null,
      deviceName: this.deviceForm.value.deviceName || null,
      devicePort: this.deviceForm.value.devicePort || null,
      ipAddress: this.deviceForm.value.ipAddress || null,
      mode: this.deviceForm.value.mode || null,
      samplingInterval: this.deviceForm.value.samplingInterval || null,
      timeout: this.deviceForm.value.timeout || null,
    };

    // Store device data in localStorage or pass as route parameter
    localStorage.setItem('currentDevice', JSON.stringify(deviceData));
    
    // Navigate to device mapping with device ID
    this.router.navigate(['/device-mapping'], {
      queryParams: { deviceId: deviceData.id }
    });
  }

  generateToast(msg: string, key: WritableSignal<string>) {
    this.messageService.add({
      severity: 'warn',
      summary: msg,
      detail: 'Invalid Fields',
      life: 3000,
      closable: true,
    });
  }
}
