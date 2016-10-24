program DelphiApp;

uses
  Vcl.Forms,
  UMainForm in 'UMainForm.pas' {MainForm},
  UMainModule in 'UMainModule.pas' {MainModule: TDataModule};

{$R *.res}

begin
  Application.Initialize();
  Application.MainFormOnTaskbar := true;

  Application.CreateForm(TMainModule, MainModule);
  Application.CreateForm(TMainForm, MainForm);
  Application.Run();
end.
